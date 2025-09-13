# Тестирование симуляции Stripe

## Настройка

1. Убедитесь, что сервер запущен
2. Получите JWT токен через авторизацию
3. Используйте токен в заголовке `Authorization: Bearer <token>`

## Эндпоинты для тестирования

### 1. Проверить текущий статус пользователя
```bash
GET /stripe/simulate/user-status
Authorization: Bearer <token>
```

### 2. Активировать подписку Pro (30 генераций)
```bash
POST /stripe/simulate/subscription-activated
Authorization: Bearer <token>
Content-Type: application/json

{
  "plan": "pro"
}
```

### 3. Активировать подписку Pro Plus (80 генераций)
```bash
POST /stripe/simulate/subscription-activated
Authorization: Bearer <token>
Content-Type: application/json

{
  "plan": "pro_plus"
}
```

### 4. Установить статус "canceling" (подписка отменена, но еще действует)
```bash
POST /stripe/simulate/subscription-canceling
Authorization: Bearer <token>
```

### 5. Установить статус "canceled" (подписка полностью отменена)
```bash
POST /stripe/simulate/subscription-canceled
Authorization: Bearer <token>
```

### 6. Добавить дополнительные генерации
```bash
POST /stripe/simulate/add-generations
Authorization: Bearer <token>
Content-Type: application/json

{
  "count": 10
}
```

## Сценарии тестирования

### Сценарий 1: Активация Pro подписки
1. Проверить текущий статус
2. Активировать Pro подписку
3. Проверить, что:
   - `plan` = "pro"
   - `subscriptionStatus` = "active"
   - `remainingGenerations` = 30
   - `subscriptionExpiresAt` установлена на месяц вперед

### Сценарий 2: Активация Pro Plus подписки
1. Активировать Pro Plus подписку
2. Проверить, что:
   - `plan` = "pro_plus"
   - `subscriptionStatus` = "active"
   - `remainingGenerations` = 80

### Сценарий 3: Тестирование статуса "canceling"
1. Установить статус "canceling"
2. Проверить, что:
   - `subscriptionStatus` = "canceling"
   - Пользователь все еще может генерировать (если есть генерации)

### Сценарий 4: Тестирование статуса "canceled"
1. Установить статус "canceled"
2. Проверить, что:
   - `subscriptionStatus` = "canceled"
   - `canGenerate()` возвращает false (если нет генераций)

### Сценарий 5: Добавление генераций
1. Добавить 10 генераций
2. Проверить, что:
   - `remainingGenerations` увеличилось на 10
   - `totalGenerations` увеличилось на 10

## Ожидаемые результаты

- **Free план**: 3 генерации
- **Pro план**: 30 генераций
- **Pro Plus план**: 80 генераций
- **Статус "active"**: пользователь может генерировать
- **Статус "canceling"**: пользователь может генерировать (если есть генерации)
- **Статус "canceled"**: пользователь не может генерировать (если нет генераций)
