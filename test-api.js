const axios = require('axios');

const SERVER_URL = 'http://localhost:3000';

async function testAPI() {
    console.log('🧪 Тестування API сервера запису на прийом\n');

    try {
        // Тест 1: Перевірка здоров'я сервера
        console.log('1️⃣ Перевірка здоров\'я сервера...');
        const healthResponse = await axios.get(`${SERVER_URL}/api/health`);
        console.log('✅ Сервер працює:', healthResponse.data);
        console.log('');

        // Тест 2: Отримання доступних часів
        console.log('2️⃣ Отримання доступних часів...');
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dateString = tomorrow.toISOString().split('T')[0];
        
        const timesResponse = await axios.get(`${SERVER_URL}/api/available-times/${dateString}`);
        console.log(`✅ Доступні години на ${dateString}:`, timesResponse.data.availableSlots?.length || 0, 'слотів');
        console.log('');

        // Тест 3: Отримання кабінетів
        console.log('3️⃣ Отримання списку кабінетів...');
        const cabinetsResponse = await axios.get(`${SERVER_URL}/api/cabinets`);
        console.log('✅ Кабінети:', cabinetsResponse.data.data?.length || 0, 'кабінетів');
        console.log('');

        // Тест 4: Тестовий запис (тільки якщо є токен)
        if (process.env.CRM_API_TOKEN && process.env.CRM_API_TOKEN !== 'YOUR_API_TOKEN_HERE') {
            console.log('4️⃣ Тестовий запис на прийом...');
            const testBooking = {
                firstName: 'Тест',
                lastName: 'Тестовий',
                phone: '+380991234567',
                email: 'test@example.com',
                appointmentDate: dateString,
                appointmentTime: timesResponse.data.availableSlots?.[0] || '10:00'
            };

            try {
                const bookingResponse = await axios.post(`${SERVER_URL}/api/book-appointment`, testBooking);
                console.log('✅ Тестовий запис створено:', bookingResponse.data);
            } catch (bookingError) {
                console.log('⚠️ Помилка створення запису (можливо, час вже зайнятий):', bookingError.response?.data?.error || bookingError.message);
            }
        } else {
            console.log('4️⃣ Пропуск тестового запису (не налаштовано CRM токен)');
        }

        console.log('\n🎉 Тестування завершено!');

    } catch (error) {
        console.error('❌ Помилка тестування:', error.response?.data || error.message);
        console.log('\n💡 Переконайтеся, що:');
        console.log('   - Сервер запущений (npm start)');
        console.log('   - CRM токен налаштований в config.env');
        console.log('   - CRM API доступний');
    }
}

// Запуск тесту
testAPI();
