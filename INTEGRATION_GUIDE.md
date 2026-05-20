# Backend Integration Guide

## Connecting Next.js Frontend with Java Backend

### 1. Backend API Endpoints Required

Your Java backend should expose these REST endpoints:

#### Authentication
```
POST /api/auth/login
POST /api/auth/signup
POST /api/auth/logout
```

#### Products
```
GET    /api/products
GET    /api/products/{id}
POST   /api/products
PUT    /api/products/{id}
DELETE /api/products/{id}
```

#### Users (Admin only)
```
GET    /api/users
GET    /api/users/{id}
PUT    /api/users/{id}
DELETE /api/users/{id}
```

#### Seller
```
POST /api/seller/onboard
GET  /api/seller/products
```

#### Cart
```
GET    /api/cart
POST   /api/cart/items
DELETE /api/cart/items/{id}
```

### 2. CORS Configuration (Spring Boot)

```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                    .allowedOrigins("http://localhost:3000")
                    .allowedMethods("GET", "POST", "PUT", "DELETE")
                    .allowedHeaders("*")
                    .allowCredentials(true);
            }
        };
    }
}
```

### 3. JWT Authentication

Backend should return JWT token on login:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "BUYER"
  }
}
```

### 4. Update Frontend API Calls

Replace mock data in components with actual API calls:

```typescript
// Example: src/app/login/page.tsx
import { authAPI } from '@/lib/api';

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const response = await authAPI.login({
      email: formData.email,
      password: formData.password
    });
    
    localStorage.setItem('token', response.token);
    login(response.user);
    router.push('/');
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

### 5. Request/Response Models

#### Login Request
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Product Response
```json
{
  "id": "1",
  "name": "Slim Fit Shirt",
  "description": "Comfortable cotton shirt",
  "price": 1299,
  "brand": "AJIO",
  "category": "shirts",
  "images": ["url1", "url2"],
  "stock": 50,
  "sellerId": "seller123"
}
```

### 6. Error Handling

Backend should return consistent error format:
```json
{
  "error": "Invalid credentials",
  "message": "Email or password is incorrect",
  "status": 401
}
```

### 7. Testing the Integration

1. Start Java backend: `./mvnw spring-boot:run`
2. Start Next.js frontend: `npm run dev`
3. Test authentication flow
4. Verify API calls in browser DevTools Network tab

### 8. Environment Variables

Update `.env.local` with your backend URL:
```
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

For production:
```
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
```
