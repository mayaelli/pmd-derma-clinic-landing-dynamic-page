# Code Audit Report - Potential Errors & Discrepancies

**Generated**: October 17, 2026  
**Project**: PMD Derma Clinic Landing Page  
**Status**: 🟡 Minor Issues Found

---

## 🔴 Critical Issues (Must Fix)

### None Found ✅

---

## 🟡 Medium Priority Issues

### 1. **React Performance: setState in useEffect** ❌
**Severity**: Medium  
**Files Affected**:
- `src/app/admin/login/page.tsx:64`
- `src/app/admin/manage/page.tsx:167`
- `src/app/admin/manage/page.tsx:450`

**Issue**: Calling `setState` synchronously within `useEffect` can cause cascading renders and hurt performance.

**Current Code** (`login/page.tsx:64`):
```typescript
useEffect(() => {
  const record = getAttemptRecord();
  const now = Date.now();

  if (record.lockedUntil && now < record.lockedUntil) {
    setLockedOut(true);  // ❌ Direct setState in effect
    setLockCountdown(Math.ceil((record.lockedUntil - now) / 1000));
    setAttemptsLeft(0);
  } else if (record.lockedUntil && now >= record.lockedUntil) {
    clearAttemptRecord();
  } else {
    setAttemptsLeft(MAX_ATTEMPTS - record.count);
  }
}, []);
```

**Solution**: Initialize state values directly or use a separate function:
```typescript
// Option 1: Initialize state with a function
const [lockedOut, setLockedOut] = useState(() => {
  const record = getAttemptRecord();
  const now = Date.now();
  return record.lockedUntil && now < record.lockedUntil;
});

// Option 2: Move logic to a separate initialization function
useEffect(() => {
  initializeLockState();
}, []);

function initializeLockState() {
  const record = getAttemptRecord();
  // ... state updates
}
```

**Impact**: May cause unnecessary re-renders, affecting performance.

---

### 2. **Next.js: Using `<a>` instead of `<Link />`** ⚠️
**Severity**: Medium  
**File**: `src/app/admin/login/page.tsx:297`

**Issue**: Using regular `<a>` tag for internal navigation instead of Next.js `<Link />` component.

**Current Code**:
```tsx
<a
  href="/"
  className="block w-full px-4 py-2.5 bg-[#CD9581] hover:bg-[#B8846F] text-white text-xs font-semibold rounded-xl text-center transition-all shadow-sm"
>
  Return to Main Website
</a>
```

**Solution**:
```tsx
import Link from "next/link";

<Link
  href="/"
  className="block w-full px-4 py-2.5 bg-[#CD9581] hover:bg-[#B8846F] text-white text-xs font-semibold rounded-xl text-center transition-all shadow-sm"
>
  Return to Main Website
</Link>
```

**Impact**: Client-side navigation won't work optimally, full page reload instead of SPA-style navigation.

---

### 3. **TypeScript: Using `any` Type** ⚠️
**Severity**: Low-Medium  
**Files Affected**:
- `src/app/admin/manage/page.tsx:143`
- `src/app/admin/manage/page.tsx:329`

**Issue**: Explicit use of `any` type defeats TypeScript's type safety.

**Current Code** (line 143):
```typescript
const handleFileChange = async (e: any) => {  // ❌
```

**Solution**:
```typescript
const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
```

**Impact**: Loss of type safety, potential runtime errors.

---

## 🟢 Low Priority / Informational

### 4. **Debug Console Logs Still in Production Code** ℹ️
**Severity**: Low  
**Files Affected**:
- `src/components/admin/DoctorManagement.tsx:124, 134`
- `src/app/admin/manage/page.tsx:572, 574, 624`

**Issue**: Debug `console.log()` statements left in code.

**Examples**:
```typescript
console.log('🔍 Loaded clinic info:', clinicInfo); // Debug log
console.log('✅ Hero set with imageUrl:', clinicInfo.image_url); // Debug log
console.log("=== PROMO SUBMIT DEBUG ===");
console.log("=== SUBMIT ERROR ===", err);
```

**Solution**: Remove or wrap in environment check:
```typescript
if (process.env.NODE_ENV === 'development') {
  console.log('🔍 Loaded clinic info:', clinicInfo);
}
```

**Impact**: Minor - clutters production console, potential info leakage.

---

### 5. **Placeholder Hardcoded Phone Format** ℹ️
**Severity**: Very Low  
**File**: `src/components/BookingModal.tsx:253`

**Issue**: Phone placeholder shows Philippine format `0917XXXXXXX`.

**Current Code**:
```tsx
<input required type="tel" placeholder="0917XXXXXXX"
```

**Consideration**: This is fine if your clinic only serves Philippine clients. Otherwise, consider:
```tsx
<input required type="tel" placeholder="+63 XXX XXX XXXX"
```

**Impact**: None - just a localization consideration.

---

## ✅ Good Practices Found

### 1. **Proper Error Handling** ✅
All async operations have try-catch blocks with proper error logging:
```typescript
try {
  const res = await fetch(url);
  const data = await res.json();
} catch (err) {
  console.error("Failed to load surgeries", err);
}
```

### 2. **Environment Variable Handling** ✅
Proper fallbacks for environment variables:
```typescript
const GOOGLE_CALENDAR_ID =
  process.env.GOOGLE_CALENDAR_ID || process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID;
```

### 3. **Type Safety** ✅
Most code uses proper TypeScript types with interfaces.

### 4. **No Security Issues** ✅
- Private keys properly handled in env vars
- No hardcoded credentials in code
- Proper API key usage (public keys only in client code)

### 5. **Image Error Handling** ✅
SafeImage component properly handles loading errors with fallbacks.

---

## 🛠️ Recommended Fixes (Priority Order)

### Immediate (Should Fix Now)
1. ✅ **Replace `<a>` with `<Link />`** in login page
   - File: `src/app/admin/login/page.tsx:297`
   - Quick fix, improves navigation

### Short Term (Fix This Week)
2. ⚠️ **Fix setState in useEffect warnings**
   - Files: `login/page.tsx`, `manage/page.tsx`
   - Improves performance
   
3. ⚠️ **Replace `any` types with proper types**
   - File: `manage/page.tsx`
   - Improves type safety

### Long Term (Clean Up)
4. ℹ️ **Remove debug console.log statements**
   - Multiple files
   - Clean up production code

---

## 📊 Code Quality Score

| Category | Score | Notes |
|----------|-------|-------|
| **Security** | 9.5/10 | No critical issues, env vars handled well |
| **Performance** | 8.0/10 | Minor setState in useEffect issues |
| **Type Safety** | 8.5/10 | Mostly good, a few `any` types |
| **Error Handling** | 9.0/10 | Comprehensive try-catch blocks |
| **Best Practices** | 8.5/10 | Minor Next.js optimization issues |
| **Overall** | **8.7/10** | 🟢 Good - Minor improvements needed |

---

## 🎯 Summary

### Issues Found
- ❌ 0 Critical
- ⚠️ 3 Medium Priority
- ℹ️ 2 Low Priority

### Action Items
1. Replace `<a>` with `<Link />` (5 minutes)
2. Fix setState in useEffect (30 minutes)
3. Replace `any` types (15 minutes)
4. Remove debug logs (10 minutes)

**Total Estimated Fix Time**: ~1 hour

---

## 📝 Notes

- ✅ No SQL injection vulnerabilities found
- ✅ No XSS vulnerabilities found
- ✅ No hardcoded secrets
- ✅ Proper input validation on forms
- ✅ Good separation of concerns
- ✅ Consistent code style

**Conclusion**: Your codebase is in good shape! The issues found are mostly minor performance optimizations and best practices. No critical bugs or security vulnerabilities detected.

---

## 🔧 Auto-Fix Available?

Some issues can be auto-fixed with:
```bash
npm run lint -- --fix
```

However, the React hooks issues require manual refactoring.
