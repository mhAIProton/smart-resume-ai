# Настройка автоматических бэкапов базы данных

## Скрипты

1. `backup-db.sh` - создание бэкапа базы данных
2. `clean-old-backups.sh` - удаление старых бэкапов (старше 2 месяцев)
3. `restore-db.sh` - восстановление базы данных из бэкапа

## Настройка crontab

### 1. Сделать скрипты исполняемыми

```bash
chmod +x /root/smart-resume-ai/server/scripts/backup-db.sh
chmod +x /root/smart-resume-ai/server/scripts/clean-old-backups.sh
chmod +x /root/smart-resume-ai/server/scripts/restore-db.sh
```

### 2. Добавить задачи в crontab

Откройте crontab для редактирования:
```bash
crontab -e
```

Добавьте следующие строки:

```cron
# Бэкап базы данных каждый час
0 * * * * cd /root/smart-resume-ai/server && ./scripts/backup-db.sh >> /var/log/backup-db.log 2>&1

# Очистка старых бэкапов каждое воскресенье в 2:00
0 2 * * 0 cd /root/smart-resume-ai/server && ./scripts/clean-old-backups.sh >> /var/log/clean-backups.log 2>&1
```

### 3. Альтернативная конфигурация (если нужны менее частые бэкапы)

```cron
# Бэкап каждые 6 часов
0 */6 * * * cd /root/smart-resume-ai/server && ./scripts/backup-db.sh >> /var/log/backup-db.log 2>&1

# Бэкап каждый день в 3:00
0 3 * * * cd /root/smart-resume-ai/server && ./scripts/backup-db.sh >> /var/log/backup-db.log 2>&1

# Очистка старых бэкапов каждое воскресенье в 2:00
0 2 * * 0 cd /root/smart-resume-ai/server && ./scripts/clean-old-backups.sh >> /var/log/clean-backups.log 2>&1
```

## Переменные окружения

Убедитесь, что в файле `.env.local` указаны правильные настройки:

```env
# Database settings
DB_HOST=localhost
DB_PORT=5432
DB_NAME=smart_resume_ai
DB_USERNAME=postgres
DB_PASSWORD=your_password

# Backup settings (опционально)
BACKUP_DIR=../backups
BACKUP_RETENTION_DAYS=60
```

## Проверка работы

### Проверить статус cron сервиса
```bash
systemctl status cron
# или
service cron status
```

### Посмотреть логи
```bash
tail -f /var/log/backup-db.log
tail -f /var/log/clean-backups.log
```

### Ручной запуск скриптов для тестирования
```bash
cd /root/smart-resume-ai/server
./scripts/backup-db.sh
./scripts/clean-old-backups.sh
```

## Восстановление из бэкапа

```bash
cd /root/smart-resume-ai/server
./scripts/restore-db.sh ./backups/smart_resume_ai_backup_20240913_120000.sql.gz
```

## Мониторинг

Рекомендуется настроить мониторинг размера папки с бэкапами:

```bash
# Проверить размер папки с бэкапами
du -sh /root/smart-resume-ai/server/backups

# Показать количество файлов бэкапов
ls -la /root/smart-resume-ai/server/backups/ | grep "smart_resume_ai_backup_" | wc -l
```