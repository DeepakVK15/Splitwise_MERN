# Steps to run the application

Install Node.js and clone this repository before executing the below steps..

# Kafka Setup

1. Download a stable version of Apache Kafka using the link https://kafka.apache.org/downloads.html.
2. Unzip the folder,open the terminal in the unzipped kafka folder.
3. Execute bin/zookeeper-server-start.sh config/zookeeper.properties.
4. Execute bin/kafka-server-start.sh config/server.properties.
5. Create the following topics: login, signup, group, mygroups, transaction, activity, profile, response_topic using the below command.
   
bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic topic_name(run one by one for the above mentioned topics).
   
# Backend

1. Navigate to backend folder of this cloned repository in the terminal.
2. Run "npm install" to install all the dependencies.
3. Update config.js file in backend folder with frontend server's IP address and port (variable_name: frontEndURI).
4. Run "node index.js" to start the backend server.
  
# Frontend

1. Open a new terminal and navigate to frontend folder of this cloned repository.
2. Run "npm install" to install all the dependencies.
3. Update uri.js file in the frontend/src folder with the backend server's IP address and port.
4. Run "npm start" to start the front end server.

# Kafka Backend

1. Open a new terminal and navigate to kafka-backend folder of this cloned repository.
2. Run "npm install" to install all the dependencies.
3. Update connection.js in the kafka-backend/kafka folder with the backend server's IP address.
4. Run "node server.js" to start the kafka-backend server.

# Launch
Open the browser and enter frontend server's IP address with port number (by default it is localhost:3000) to use the application.



