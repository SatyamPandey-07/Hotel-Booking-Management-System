# Railway Deployment Configuration
This project is configured for automatic deployment on Railway.

## Build Configuration
- Java Version: 17
- Build Tool: Maven
- Build Command: `mvn clean package -DskipTests`
- Start Command: `java -Dserver.port=$PORT -jar target/hotel-booking-system-0.0.1-SNAPSHOT.jar`

## Required Environment Variables
Set these in Railway dashboard:
- `JWT_SECRET`: Your JWT secret key (use: cdlikRcr+QqpNjLkTu9Zbgc9oO95+UqjLCq7ZWvfX1c=)

## Port Configuration
Railway automatically provides $PORT environment variable. The application will bind to this port.
