// Kafka is optional for deployments that don't run a broker. If kafkajs is
// unavailable or KAFKA_BROKERS env not provided, export a no-op client that
// preserves the public API.
let KafkaLib = null;
try {
  KafkaLib = require('kafkajs');
} catch (e) {
  // fall back to no-op implementation
}

class KafkaClient {
  constructor() {
    this.kafka = null;
    this.producer = null;
    this.consumer = null;
    this.admin = null;
    this.isConnected = false;
    this.isEnabled = Boolean(KafkaLib) && Boolean(process.env.KAFKA_BROKERS);
  }

  async connect() {
    try {
      if (!this.isEnabled) {
        console.warn('Kafka disabled: kafkajs not installed or KAFKA_BROKERS not set.');
        return false;
      }
      const kafkaConfig = {
        clientId: process.env.KAFKA_CLIENT_ID || 'devconnect-app',
        brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
        retry: {
          initialRetryTime: 100,
          retries: 8
        },
        connectionTimeout: 3000,
        requestTimeout: 25000,
      };

      this.kafka = new KafkaLib.Kafka(kafkaConfig);
      this.producer = this.kafka.producer({
        createPartitioner: KafkaLib.Partitioners.LegacyPartitioner
      });
      this.consumer = this.kafka.consumer({ groupId: 'devconnect-group' });
      this.admin = this.kafka.admin();

      await this.producer.connect();
      await this.consumer.connect();
      await this.admin.connect();

      this.isConnected = true;
      console.log('Kafka connected successfully');

      // Create topics if they don't exist
      await this.createTopics();

      return true;
    } catch (error) {
      console.error('Failed to connect to Kafka:', error);
      this.isConnected = false;
      // Don't crash the app; continue without Kafka
      this.isEnabled = false;
      return false;
    }
  }

  async createTopics() {
    try {
      const topics = [
        {
          topic: 'user-events',
          numPartitions: 3,
          replicationFactor: 1
        },
        {
          topic: 'message-events',
          numPartitions: 3,
          replicationFactor: 1
        },
        {
          topic: 'connection-events',
          numPartitions: 3,
          replicationFactor: 1
        },
        {
          topic: 'notification-events',
          numPartitions: 3,
          replicationFactor: 1
        },
        {
          topic: 'analytics-events',
          numPartitions: 3,
          replicationFactor: 1
        }
      ];

      await this.admin.createTopics({
        topics: topics,
        waitForLeaders: true
      });

      console.log('Kafka topics created successfully');
    } catch (error) {
      if (error.type === 'TOPIC_ALREADY_EXISTS') {
        console.log('Kafka topics already exist');
      } else {
        console.error('Error creating Kafka topics:', error);
      }
    }
  }

  async disconnect() {
    try {
      if (this.producer) {
        await this.producer.disconnect();
      }
      if (this.consumer) {
        await this.consumer.disconnect();
      }
      if (this.admin) {
        await this.admin.disconnect();
      }
      this.isConnected = false;
      console.log('Kafka disconnected');
    } catch (error) {
      console.error('Error disconnecting from Kafka:', error);
    }
  }

  // Producer methods
  async publishUserEvent(eventType, userId, eventData) {
    if (!this.isConnected) return false;
    try {
      const message = {
        eventType,
        userId,
        timestamp: new Date().toISOString(),
        data: eventData
      };

      await this.producer.send({
        topic: 'user-events',
        messages: [{
          key: userId,
          value: JSON.stringify(message)
        }]
      });

      console.log(`User event published: ${eventType} for user ${userId}`);
      return true;
    } catch (error) {
      console.error('Error publishing user event:', error);
      return false;
    }
  }

  async publishMessageEvent(eventType, messageData) {
    if (!this.isConnected) return false;
    try {
      const message = {
        eventType,
        timestamp: new Date().toISOString(),
        data: messageData
      };

      await this.producer.send({
        topic: 'message-events',
        messages: [{
          key: messageData.fromUserId || messageData.toUserId,
          value: JSON.stringify(message)
        }]
      });

      console.log(`Message event published: ${eventType}`);
      return true;
    } catch (error) {
      console.error('Error publishing message event:', error);
      return false;
    }
  }

  async publishConnectionEvent(eventType, connectionData) {
    if (!this.isConnected) return false;
    try {
      const message = {
        eventType,
        timestamp: new Date().toISOString(),
        data: connectionData
      };

      await this.producer.send({
        topic: 'connection-events',
        messages: [{
          key: connectionData.fromUserId || connectionData.toUserId,
          value: JSON.stringify(message)
        }]
      });

      console.log(`Connection event published: ${eventType}`);
      return true;
    } catch (error) {
      console.error('Error publishing connection event:', error);
      return false;
    }
  }

  async publishNotificationEvent(eventType, notificationData) {
    if (!this.isConnected) return false;
    try {
      const message = {
        eventType,
        timestamp: new Date().toISOString(),
        data: notificationData
      };

      await this.producer.send({
        topic: 'notification-events',
        messages: [{
          key: notificationData.userId,
          value: JSON.stringify(message)
        }]
      });

      console.log(`Notification event published: ${eventType}`);
      return true;
    } catch (error) {
      console.error('Error publishing notification event:', error);
      return false;
    }
  }

  async publishAnalyticsEvent(eventType, analyticsData) {
    if (!this.isConnected) return false;
    try {
      const message = {
        eventType,
        timestamp: new Date().toISOString(),
        data: analyticsData
      };

      await this.producer.send({
        topic: 'analytics-events',
        messages: [{
          key: analyticsData.userId || 'system',
          value: JSON.stringify(message)
        }]
      });

      console.log(`Analytics event published: ${eventType}`);
      return true;
    } catch (error) {
      console.error('Error publishing analytics event:', error);
      return false;
    }
  }

  // Consumer methods
  async subscribeToUserEvents(callback) {
    if (!this.isConnected) return false;
    try {
      await this.consumer.subscribe({ topic: 'user-events', fromBeginning: false });
      
      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          try {
            const eventData = JSON.parse(message.value.toString());
            await callback(eventData);
          } catch (error) {
            console.error('Error processing user event:', error);
          }
        },
      });

      console.log('Subscribed to user events');
      return true;
    } catch (error) {
      console.error('Error subscribing to user events:', error);
      return false;
    }
  }

  async subscribeToMessageEvents(callback) {
    if (!this.isConnected) return false;
    try {
      await this.consumer.subscribe({ topic: 'message-events', fromBeginning: false });
      
      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          try {
            const eventData = JSON.parse(message.value.toString());
            await callback(eventData);
          } catch (error) {
            console.error('Error processing message event:', error);
          }
        },
      });

      console.log('Subscribed to message events');
      return true;
    } catch (error) {
      console.error('Error subscribing to message events:', error);
      return false;
    }
  }

  async subscribeToConnectionEvents(callback) {
    if (!this.isConnected) return false;
    try {
      await this.consumer.subscribe({ topic: 'connection-events', fromBeginning: false });
      
      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          try {
            const eventData = JSON.parse(message.value.toString());
            await callback(eventData);
          } catch (error) {
            console.error('Error processing connection event:', error);
          }
        },
      });

      console.log('Subscribed to connection events');
      return true;
    } catch (error) {
      console.error('Error subscribing to connection events:', error);
      return false;
    }
  }

  async subscribeToNotificationEvents(callback) {
    if (!this.isConnected) return false;
    try {
      await this.consumer.subscribe({ topic: 'notification-events', fromBeginning: false });
      
      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          try {
            const eventData = JSON.parse(message.value.toString());
            await callback(eventData);
          } catch (error) {
            console.error('Error processing notification event:', error);
          }
        },
      });

      console.log('Subscribed to notification events');
      return true;
    } catch (error) {
      console.error('Error subscribing to notification events:', error);
      return false;
    }
  }

  async subscribeToAnalyticsEvents(callback) {
    if (!this.isConnected) return false;
    try {
      await this.consumer.subscribe({ topic: 'analytics-events', fromBeginning: false });
      
      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          try {
            const eventData = JSON.parse(message.value.toString());
            await callback(eventData);
          } catch (error) {
            console.error('Error processing analytics event:', error);
          }
        },
      });

      console.log('Subscribed to analytics events');
      return true;
    } catch (error) {
      console.error('Error subscribing to analytics events:', error);
      return false;
    }
  }
}

const kafkaClient = new KafkaClient();
module.exports = kafkaClient;
