#!/usr/bin/env node

/**
 * Security Validation Script
 * Runs on startup to verify security configuration
 */

const fs = require('fs')
const path = require('path')

console.log('\n🔒 Memorra Admin Panel - Security Validation\n')

const checks = [
  {
    name: 'Environment Variables',
    fn: () => {
      const envLocal = path.join(process.cwd(), '.env.local')
      const envExample = path.join(process.cwd(), '.env.example')
      
      if (!fs.existsSync(envLocal)) {
        throw new Error(
          'Missing .env.local file. Copy from .env.example and fill in actual values.\n' +
          'Command: cp .env.example .env.local'
        )
      }

      const env = fs.readFileSync(envLocal, 'utf-8')
      
      if (env.includes('your_jwt_secret_key')) {
        throw new Error('JWT_SECRET contains placeholder value. Set a real secret in .env.local')
      }
      
      if (env.includes('your_jwt_refresh_secret')) {
        throw new Error('JWT_REFRESH_SECRET contains placeholder value. Set a real secret in .env.local')
      }

      const jwtSecret = process.env.JWT_SECRET
      if (jwtSecret && jwtSecret.length < 32) {
        throw new Error('JWT_SECRET must be at least 32 characters long')
      }

      return 'Environment variables validated ✓'
    },
  },
  {
    name: 'Middleware Configuration',
    fn: () => {
      const middlewarePath = path.join(process.cwd(), 'middleware.ts')
      if (!fs.existsSync(middlewarePath)) {
        throw new Error('middleware.ts not found. Security middleware is required.')
      }
      return 'Middleware configured ✓'
    },
  },
  {
    name: 'Security Utilities',
    fn: () => {
      const securityPath = path.join(process.cwd(), 'lib/security.ts')
      if (!fs.existsSync(securityPath)) {
        throw new Error('lib/security.ts not found. Security utilities are required.')
      }
      return 'Security utilities available ✓'
    },
  },
  {
    name: 'Auth Routes',
    fn: () => {
      const loginPath = path.join(process.cwd(), 'app/api/auth/login/route.ts')
      const logoutPath = path.join(process.cwd(), 'app/api/auth/logout/route.ts')
      const verifyPath = path.join(process.cwd(), 'app/api/auth/verify/route.ts')
      
      if (!fs.existsSync(loginPath)) {
        throw new Error('Login route not found')
      }
      if (!fs.existsSync(logoutPath)) {
        throw new Error('Logout route not found')
      }
      if (!fs.existsSync(verifyPath)) {
        throw new Error('Verify route not found')
      }
      
      return 'Auth routes configured ✓'
    },
  },
  {
    name: 'TypeScript Configuration',
    fn: () => {
      const tsConfig = path.join(process.cwd(), 'tsconfig.json')
      if (!fs.existsSync(tsConfig)) {
        throw new Error('tsconfig.json not found')
      }
      
      const config = JSON.parse(fs.readFileSync(tsConfig, 'utf-8'))
      
      // Check for security-relevant settings
      if (config.compilerOptions?.strict !== true) {
        console.warn('⚠️  TypeScript strict mode is recommended for security')
      }
      
      return 'TypeScript configuration valid ✓'
    },
  },
  {
    name: 'Git Ignore',
    fn: () => {
      const gitignorePath = path.join(process.cwd(), '.gitignore')
      let gitignore = ''
      
      if (fs.existsSync(gitignorePath)) {
        gitignore = fs.readFileSync(gitignorePath, 'utf-8')
      }
      
      const sensitivePatterns = ['.env.local', '.env.*.local', 'node_modules']
      const missing = sensitivePatterns.filter(pattern => !gitignore.includes(pattern))
      
      if (missing.length > 0) {
        throw new Error(
          `Missing patterns in .gitignore: ${missing.join(', ')}\n` +
          'This could expose secrets if committed to version control!'
        )
      }
      
      return 'Git ignore properly configured ✓'
    },
  },
]

let passed = 0
let failed = 0

for (const check of checks) {
  try {
    const result = check.fn()
    console.log(`✅ ${check.name}`)
    console.log(`   ${result}\n`)
    passed++
  } catch (error) {
    console.log(`❌ ${check.name}`)
    console.log(`   Error: ${error.message}\n`)
    failed++
  }
}

console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
console.log(`Security Validation Results:`)
console.log(`✅ Passed: ${passed}`)
console.log(`❌ Failed: ${failed}`)
console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`)

if (failed > 0) {
  console.error('🔴 SECURITY VALIDATION FAILED')
  console.error('Please fix the issues above before running the application.\n')
  process.exit(1)
} else {
  console.log('🟢 SECURITY VALIDATION PASSED')
  console.log('Application is ready to run.\n')
  process.exit(0)
}
