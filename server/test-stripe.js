// Простой скрипт для тестирования API симуляции Stripe
// Запуск: node test-stripe.js

const BASE_URL = 'http://localhost:3000/api/v1'; // Измените на ваш URL сервера
const JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhM2QyMzNjNS0zM2JkLTQ5Y2UtYjE3Ny0xMTEzZWYxNTkyOTEiLCJlbWFpbCI6InVkamluLmFydmVsQGdtYWlsLmNvbSIsIm5hbWUiOiLQldCy0LPQtdC90LjQuSDQkNGA0LLQtdC70L7QsiIsInBsYW4iOiJwcm9fcGx1cyIsImlhdCI6MTc1NzY3NDAxOCwiZXhwIjoxNzU4Mjc4ODE4fQ._DVu4367j-ur4akC0uQxhw_WgsJGK_fiYsXqo9SPrOw'; // Замените на ваш токен

async function makeRequest(endpoint, method = 'GET', body = null) {
  const url = `${BASE_URL}${endpoint}`;
  const options = {
    method,
    headers: {
      'Authorization': `Bearer ${JWT_TOKEN}`,
      'Content-Type': 'application/json',
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    
    console.log(`\n=== ${method} ${endpoint} ===`);
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    return data;
  } catch (error) {
    console.error(`Error ${method} ${endpoint}:`, error.message);
    return null;
  }
}

async function runTests() {
  console.log('🚀 Начинаем тестирование симуляции Stripe...\n');

  // 1. Проверить текущий статус
  console.log('1. Проверяем текущий статус пользователя...');
  await makeRequest('/stripe/simulate/user-status');

  // 2. Активировать Pro подписку
  console.log('\n2. Активируем Pro подписку...');
  await makeRequest('/stripe/simulate/subscription-activated', 'POST', { plan: 'pro' });

  // 3. Проверить статус после активации
  console.log('\n3. Проверяем статус после активации Pro...');
  await makeRequest('/stripe/simulate/user-status');

  // 4. Активировать Pro Plus подписку
  console.log('\n4. Активируем Pro Plus подписку...');
  await makeRequest('/stripe/simulate/subscription-activated', 'POST', { plan: 'pro_plus' });

  // 5. Проверить статус после активации Pro Plus
  console.log('\n5. Проверяем статус после активации Pro Plus...');
  await makeRequest('/stripe/simulate/user-status');

  // 6. Установить статус "canceling"
  console.log('\n6. Устанавливаем статус "canceling"...');
  await makeRequest('/stripe/simulate/subscription-canceling', 'POST');

  // 7. Проверить статус "canceling"
  console.log('\n7. Проверяем статус "canceling"...');
  await makeRequest('/stripe/simulate/user-status');

  // 8. Установить статус "canceled"
  console.log('\n8. Устанавливаем статус "canceled"...');
  await makeRequest('/stripe/simulate/subscription-canceled', 'POST');

  // 9. Проверить статус "canceled"
  console.log('\n9. Проверяем статус "canceled"...');
  await makeRequest('/stripe/simulate/user-status');

  // 10. Добавить генерации
  console.log('\n10. Добавляем 10 генераций...');
  await makeRequest('/stripe/simulate/add-generations', 'POST', { count: 10 });

  // 11. Финальная проверка статуса
  console.log('\n11. Финальная проверка статуса...');
  await makeRequest('/stripe/simulate/user-status');

  console.log('\n✅ Тестирование завершено!');
}

// Запуск тестов
runTests().catch(console.error);
