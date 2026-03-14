# Architecture Design

## Scaling to 100k users
- Use load balancer
- Deploy multiple Node.js instances
- Use MongoDB Atlas cluster
- Cache insights using Redis

## Reducing LLM cost
- Cache repeated journal analysis
- Use smaller models
- Limit token length

## Caching repeated analysis
- Store analysis result in database
- Check if text already analyzed
- Return cached response

## Protecting sensitive journal data
- HTTPS encryption
- Authentication
- Database encryption
- Access control
