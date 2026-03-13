# Login Form Validation Pattern

## Overview

This document explains the form validation pattern implemented in the Login page, following the same architecture as the Register page.

## Tech Stack

| Library | Purpose |
|---------|---------|
| `react-hook-form` | Form state management and validation |
| `zod` | Schema validation and type inference |
| `@hookform/resolvers/zod` | Bridge between react-hook-form and zod |

## Implementation Structure

### 1. Imports

```tsx
import { BookOpen, Lock, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { axiosInstance } from "../lib/axios";
import { useState } from "react";
```

### 2. Zod Schema Definition

```tsx
const formSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, { message: "Password must be at least 6 char" }),
});

type FormData = z.infer<typeof formSchema>;
```

**Features:**
- `email`: Validates that the input is a valid email format
- `password`: Requires minimum 6 characters
- `FormData`: TypeScript type automatically inferred from schema

### 3. Form Hook Setup

```tsx
const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm<FormData>({
  resolver: zodResolver(formSchema),
});
```

**Features:**
- `register`: Function to connect inputs to react-hook-form
- `handleSubmit`: Wrapper for form submission with validation
- `errors`: Contains validation error messages

### 4. Navigation Hook

```tsx
const navigate = useNavigate();
```

Used to redirect users after successful login.

### 5. Loading State

```tsx
const [isPending, setIsPending] = useState(false);
```

Tracks the async submission state to:
- Disable the submit button
- Show "Loading" text on the button

### 6. Submit Handler

```tsx
const onSubmit = async (data: FormData) => {
  setIsPending(true);
  try {
    await axiosInstance.post("/users/login", {
      email: data.email,
      password: data.password,
    });

    alert("Login success!");
    navigate("/");
  } catch (error) {
    console.log(error);
    alert("Login failed!");
  } finally {
    setIsPending(false);
  }
};
```

**Features:**
- Sets loading state before API call
- Sends POST request to `/users/login` endpoint
- Navigates to home page on success
- Handles errors gracefully
- Resets loading state in finally block

### 7. Form JSX Structure

```tsx
<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
  <div>
    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
      Email Address
    </label>
    <div className="relative">
      <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
      <input
        {...register("email")}
        type="email"
        id="email"
        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition"
        placeholder="you@example.com"
      />
    </div>
    {errors.email && (
      <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
    )}
  </div>

  <button
    type="submit"
    disabled={isPending}
    className="w-full bg-yellow-500 text-white py-3 rounded-lg font-semibold hover:bg-purple-600 transition-colors shadow-md"
  >
    {isPending ? "Loading" : "Login"}
  </button>
</form>
```

**Features:**
- `onSubmit={handleSubmit(onSubmit)}`: Validates before calling onSubmit
- `{...register("field")}`: Connects input to react-hook-form
- Error message displayed conditionally below each input
- Button disabled during submission

## Validation Rules

| Field | Rules | Error Message |
|-------|-------|---------------|
| email | Required, valid email format | "Invalid email" |
| password | Required, min 6 characters | "Password must be at least 6 char" |

## User Experience Features

1. **Real-time Validation**: Errors display as users interact with fields
2. **Loading Indicator**: Button text changes to "Loading" during submission
3. **Disabled State**: Button is disabled while processing to prevent duplicate submissions
4. **Visual Feedback**: Red error text below invalid fields
5. **Consistent Styling**: Matches Register page design pattern

## Flow Diagram

```
User fills form
      ↓
Click Submit
      ↓
handleSubmit validates
      ↓
   Valid? ──── No → Show errors
      ↓ Yes
Set isPending = true
      ↓
API POST /users/login
      ↓
   Success? ──── No → Show error alert
      ↓ Yes
Show success alert
      ↓
Navigate to "/"
      ↓
Set isPending = false
```

## Benefits of This Pattern

1. **Type Safety**: TypeScript types inferred from zod schema
2. **Single Source of Truth**: Validation rules defined once in schema
3. **Reusable**: Same pattern used across Register and Login pages
4. **Maintainable**: Easy to add/modify validation rules
5. **Accessible**: Proper label-input associations with htmlFor/id
