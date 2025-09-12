# Настройка Stripe для клиента

## Переменные окружения

Создайте файл `.env.local` в папке `client/` со следующим содержимым:

```env
# API Configuration
VITE_API_URL=http://localhost:3000/api/v1

# Stripe Price IDs (замените на ваши реальные Price ID из Stripe Dashboard)
VITE_STRIPE_PRO_PRICE_ID=price_1234567890_pro
VITE_STRIPE_PRO_PLUS_PRICE_ID=price_1234567890_pro_plus
```

## Как получить Price ID из Stripe

1. Войдите в [Stripe Dashboard](https://dashboard.stripe.com/)
2. Перейдите в раздел "Products"
3. Найдите ваши продукты Pro и Pro Plus
4. Скопируйте Price ID для каждого продукта
5. Замените значения в `.env.local`

## Важно

Price ID в клиенте должны соответствовать тем, что указаны в `server/.env.local`:
- `VITE_STRIPE_PRO_PRICE_ID` соответствует `STRIPE_PRO_PRICE_ID`
- `VITE_STRIPE_PRO_PLUS_PRICE_ID` соответствует `STRIPE_PRO_PLUS_PRICE_ID`

## Тестирование

После настройки переменных окружения:
1. Перезапустите клиент: `npm run dev`
2. Откройте SubscriptionsPopup
3. Выберите план Pro или Pro Plus
4. Нажмите "Upgrade"
5. Вы должны быть перенаправлены на Stripe Checkout
