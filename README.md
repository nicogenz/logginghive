# LoggingHive

LoggingHive is an open-source, self-hostable logging platform built for simplicity and ease of use. Keep track of your
application logs in a centralized, organized way without the complexity of enterprise solutions.

## Features

- 🚀 **Simple Setup** - Get started in minutes with Docker
- 🔐 **Secure** - Built-in authentication and API key management
- 📊 **Organized** - Structure logs by organizations and projects
- 🐳 **Self-Hostable** - Complete control over your data
- 🔍 **Log Management** - Filter and search through your log entries
- 🔑 **API Key Management** - Generate and manage API keys per project

## Quick Start

### Prerequisites

You need to provide a database URL via the `DATABASE_URL` environment variable. LoggingHive uses PostgreSQL as its
database.

### Docker (Recommended)

1. Pull the Docker image:
   ```bash
   docker pull ghcr.io/nicogenz/logginghive:latest
   ```

2. Run the container:
   ```bash
   docker run -p 3000:3000 \
     -e DATABASE_URL="postgresql://username:password@host:5432/database" \
     --name logginghive \
     ghcr.io/nicogenz/logginghive:latest
   ```

3. Access LoggingHive at `http://localhost:3000`

## Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/nicogenz/logginghive.git
   cd logginghive
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your environment variables:
   ```bash
   echo 'DATABASE_URL="postgresql://username:password@localhost:5432/database"' > .env
   ```

4. Run database migrations:
   ```bash
   npm run db:dev:migrate
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Access the application at `http://localhost:3000`

## Usage

### Sending Logs to LoggingHive

Once you have created an organization, project, and API key, you can send logs using a simple HTTP POST request:

```bash
curl -X POST http://localhost:3000/api/v1/log-entries \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-api-key-here" \
  -d '{
    "message": "This is a log message",
    "level": "INFO",
    "metadata": {
      "userId": "12345",
      "action": "user_login"
    }
  }'
```

Available log levels: `DEBUG`, `INFO`, `WARN`, `ERROR`, `FATAL`

## Environment Variables

| Variable       | Description                  | Required | Default |
|----------------|------------------------------|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Yes      | -       |

## Building from Source

```bash
# Install dependencies
npm install

# Generate Prisma client
npm run db:generate

# Build the application
npm run build

# Start the production server
npm run start
```

## Database Management

```bash
# Generate Prisma client
npm run db:generate

# Push schema changes (development)
npm run db:dev:push

# Create a migration (development)
npm run db:dev:migrate

# Deploy migrations (production)
npm run db:prod:migrate

# Reset database (development)
npm run db:dev:reset
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Support

If you encounter any issues or have questions, please open an issue on GitHub.

