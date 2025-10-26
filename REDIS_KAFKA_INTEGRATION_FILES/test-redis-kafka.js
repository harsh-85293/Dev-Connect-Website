const redisClient = require('./src/config/redis');
const kafkaClient = require('./src/config/kafka');

async function testRedisKafkaIntegration() {
    console.log('🧪 Testing Redis and Kafka Integration');
    console.log('=====================================');

    try {
        // Test Redis connection
        console.log('🔍 Testing Redis connection...');
        await redisClient.connect();
        console.log('✅ Redis connected successfully');

        // Test Redis operations
        console.log('🔍 Testing Redis operations...');
        await redisClient.set('test:key', { message: 'Hello Redis!', timestamp: new Date() });
        const testData = await redisClient.get('test:key');
        console.log('✅ Redis set/get operations working:', testData);

        // Test Redis session management
        console.log('🔍 Testing Redis session management...');
        await redisClient.setSession('test-token', { userId: 'test-user', emailId: 'test@example.com' });
        const sessionData = await redisClient.getSession('test-token');
        console.log('✅ Redis session management working:', sessionData);

        // Test Redis user data caching
        console.log('🔍 Testing Redis user data caching...');
        await redisClient.setUserData('test-user', { 
            firstName: 'Test', 
            lastName: 'User', 
            emailId: 'test@example.com' 
        });
        const userData = await redisClient.getUserData('test-user');
        console.log('✅ Redis user data caching working:', userData);

        // Test Redis presence management
        console.log('🔍 Testing Redis presence management...');
        await redisClient.setUserPresence('test-user', 'socket-123');
        const presence = await redisClient.getUserPresence('test-user');
        console.log('✅ Redis presence management working:', presence);

        // Test Redis rate limiting
        console.log('🔍 Testing Redis rate limiting...');
        const rateLimitKey = 'rate_limit:test:action';
        const count1 = await redisClient.incrementRateLimit(rateLimitKey, 60);
        const count2 = await redisClient.incrementRateLimit(rateLimitKey, 60);
        console.log('✅ Redis rate limiting working:', { count1, count2 });

        // Test Kafka connection
        console.log('🔍 Testing Kafka connection...');
        await kafkaClient.connect();
        console.log('✅ Kafka connected successfully');

        // Test Kafka user event publishing
        console.log('🔍 Testing Kafka user event publishing...');
        const userEventResult = await kafkaClient.publishUserEvent('TEST_EVENT', 'test-user', {
            message: 'Test user event',
            timestamp: new Date().toISOString()
        });
        console.log('✅ Kafka user event publishing working:', userEventResult);

        // Test Kafka message event publishing
        console.log('🔍 Testing Kafka message event publishing...');
        const messageEventResult = await kafkaClient.publishMessageEvent('TEST_MESSAGE_EVENT', {
            fromUserId: 'user1',
            toUserId: 'user2',
            text: 'Test message',
            timestamp: new Date().toISOString()
        });
        console.log('✅ Kafka message event publishing working:', messageEventResult);

        // Test Kafka connection event publishing
        console.log('🔍 Testing Kafka connection event publishing...');
        const connectionEventResult = await kafkaClient.publishConnectionEvent('TEST_CONNECTION_EVENT', {
            fromUserId: 'user1',
            toUserId: 'user2',
            status: 'interested',
            timestamp: new Date().toISOString()
        });
        console.log('✅ Kafka connection event publishing working:', connectionEventResult);

        // Test Kafka notification event publishing
        console.log('🔍 Testing Kafka notification event publishing...');
        const notificationEventResult = await kafkaClient.publishNotificationEvent('TEST_NOTIFICATION_EVENT', {
            userId: 'test-user',
            message: 'Test notification',
            timestamp: new Date().toISOString()
        });
        console.log('✅ Kafka notification event publishing working:', notificationEventResult);

        // Test Kafka analytics event publishing
        console.log('🔍 Testing Kafka analytics event publishing...');
        const analyticsEventResult = await kafkaClient.publishAnalyticsEvent('TEST_ANALYTICS_EVENT', {
            userId: 'test-user',
            action: 'test_action',
            timestamp: new Date().toISOString()
        });
        console.log('✅ Kafka analytics event publishing working:', analyticsEventResult);

        console.log('');
        console.log('🎉 All tests passed successfully!');
        console.log('');
        console.log('📋 Integration Summary:');
        console.log('   ✅ Redis connection and operations');
        console.log('   ✅ Redis session management');
        console.log('   ✅ Redis user data caching');
        console.log('   ✅ Redis presence management');
        console.log('   ✅ Redis rate limiting');
        console.log('   ✅ Kafka connection');
        console.log('   ✅ Kafka event publishing (all topics)');
        console.log('');
        console.log('🚀 Your DevConnect application is ready to use Redis and Kafka!');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.error('Stack trace:', error.stack);
        process.exit(1);
    } finally {
        // Cleanup
        try {
            await redisClient.disconnect();
            await kafkaClient.disconnect();
            console.log('🧹 Cleanup completed');
        } catch (error) {
            console.error('⚠️ Cleanup error:', error.message);
        }
    }
}

// Run the test
testRedisKafkaIntegration();
