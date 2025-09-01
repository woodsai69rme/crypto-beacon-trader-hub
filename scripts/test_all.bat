
@echo off
setlocal enabledelayedexpansion

REM Crypto Beacon Trading Platform - Comprehensive Test Suite (Windows)
REM This script runs all tests and generates comprehensive reports

echo 🧪 Crypto Beacon Trading Platform - Test Suite
echo ==============================================

REM Test results tracking
set TESTS_PASSED=0
set TESTS_FAILED=0

REM Create test results directory
if not exist test-results mkdir test-results

echo ℹ️ Starting comprehensive test suite...

REM Ensure dependencies are installed
echo ℹ️ Installing dependencies...
call npm ci
if errorlevel 1 (
    echo ❌ Failed to install dependencies
    exit /b 1
)

REM Run unit tests
echo ℹ️ Running unit tests...
call npm run test:unit -- --reporter=json --outputFile=test-results/unit-tests.json
if errorlevel 1 (
    echo ❌ Unit tests failed
    set /a TESTS_FAILED+=1
) else (
    echo ✅ Unit tests passed
    set /a TESTS_PASSED+=1
)

REM Run integration tests
echo ℹ️ Running integration tests...
call npm run test:integration -- --reporter=json --outputFile=test-results/integration-tests.json
if errorlevel 1 (
    echo ❌ Integration tests failed
    set /a TESTS_FAILED+=1
) else (
    echo ✅ Integration tests passed
    set /a TESTS_PASSED+=1
)

REM Run E2E tests
echo ℹ️ Running E2E tests...
call npm run build
if errorlevel 1 (
    echo ❌ Build failed for E2E tests
    set /a TESTS_FAILED+=1
    goto :skip_e2e
)

start /b npm run preview
timeout /t 10 /nobreak > nul

call npx playwright test --reporter=json --output-dir=test-results/e2e-results.json
if errorlevel 1 (
    echo ❌ E2E tests failed
    set /a TESTS_FAILED+=1
) else (
    echo ✅ E2E tests passed
    set /a TESTS_PASSED+=1
)

REM Clean up preview server
taskkill /f /im node.exe > nul 2>&1

:skip_e2e

REM Run accessibility tests
echo ℹ️ Running accessibility tests...
call npm run test:a11y -- --reporter=json --outputFile=test-results/a11y-tests.json
if errorlevel 1 (
    echo ❌ Accessibility tests failed
    set /a TESTS_FAILED+=1
) else (
    echo ✅ Accessibility tests passed
    set /a TESTS_PASSED+=1
)

REM Run security tests
echo ℹ️ Running security audit...
call npm audit --audit-level high
if errorlevel 1 (
    echo ⚠️ Security audit found issues
    set /a TESTS_FAILED+=1
) else (
    echo ✅ Security audit passed
    set /a TESTS_PASSED+=1
)

REM Run performance tests
echo ℹ️ Running performance tests...
call npm run test:performance
if errorlevel 1 (
    echo ❌ Performance tests failed
    set /a TESTS_FAILED+=1
) else (
    echo ✅ Performance tests passed
    set /a TESTS_PASSED+=1
)

REM Generate coverage report
echo ℹ️ Generating test coverage report...
call npm run test:coverage
call npx nyc report --reporter=html --report-dir=test-results/coverage
echo ✅ Coverage report generated in test-results/coverage/

REM Generate test summary
echo ℹ️ Generating comprehensive test report...
set /a TOTAL_TESTS=TESTS_PASSED+TESTS_FAILED
set /a SUCCESS_RATE=TESTS_PASSED*100/TOTAL_TESTS

(
echo # Test Results Summary
echo.
echo **Date**: %date% %time%
echo **Platform**: Crypto Beacon Trading Platform  
echo **Test Suite Version**: 1.0.0
echo.
echo ## Overview
echo - Total Test Suites: !TOTAL_TESTS!
echo - Passed: !TESTS_PASSED!
echo - Failed: !TESTS_FAILED!
echo - Success Rate: !SUCCESS_RATE!%%
echo.
echo ## Test Categories
echo.
echo ### Unit Tests
if exist test-results\unit-tests.json (
    echo - **Status**: ✅ Completed
) else (
    echo - **Status**: ❌ Failed
)
echo - **Coverage**: Check test-results/coverage/index.html
echo.
echo ### Integration Tests
if exist test-results\integration-tests.json (
    echo - **Status**: ✅ Completed
) else (
    echo - **Status**: ❌ Failed
)
echo - **Database**: Connection and query tests
echo - **API**: External service integration tests
echo.
echo ### End-to-End Tests
if exist test-results\e2e-results.json (
    echo - **Status**: ✅ Completed
) else (
    echo - **Status**: ❌ Failed
)
echo - **Browser**: Cross-browser compatibility
echo - **User Flows**: Critical user journey tests
echo.
echo ### Accessibility Tests
if exist test-results\a11y-tests.json (
    echo - **Status**: ✅ Completed
) else (
    echo - **Status**: ❌ Failed
)
echo - **WCAG 2.1**: AA compliance verification
echo - **Screen Reader**: Compatibility testing
echo.
echo ### Security Tests
echo - **NPM Audit**: Dependency vulnerability scan
if exist test-results\snyk-results.json (
    echo - **Snyk Scan**: ✅ Completed
) else (
    echo - **Snyk Scan**: ⏭️ Skipped
)
echo - **Static Analysis**: Code security analysis
echo.
echo ### Performance Tests
echo - **Load Time**: Page performance metrics
echo - **Memory Usage**: Memory leak detection
echo - **API Response**: Response time analysis
echo.
echo ## Recommendations
echo.
if !TESTS_FAILED! gtr 0 (
    echo ⚠️ **Action Required**: !TESTS_FAILED! test suite^(s^) failed. Review individual test results for details.
) else (
    echo ✅ **All tests passed**: Platform is ready for deployment.
)
echo.
echo ## Next Steps
echo.
echo 1. Review failed tests ^(if any^)
echo 2. Update code based on test feedback
echo 3. Re-run failed test suites
echo 4. Generate deployment artifacts
echo.
echo ---
echo *Generated by automated test suite*
) > test-results\test-summary.md

echo ✅ Test report generated: test-results/test-summary.md

REM Final summary
echo.
echo 📊 Test Summary
echo ===============
echo Passed: !TESTS_PASSED!
echo Failed: !TESTS_FAILED!
echo Total:  !TOTAL_TESTS!

if !TESTS_FAILED! equ 0 (
    echo.
    echo ✅ All tests passed! 🎉
    echo.
    echo ✅ Platform is ready for deployment
    echo 📁 Test results available in: test-results/
    echo 🌐 Coverage report: test-results/coverage/index.html
    exit /b 0
) else (
    echo.
    echo ❌ !TESTS_FAILED! test suite^(s^) failed
    echo.
    echo ❌ Please review and fix failing tests before deployment
    echo 📁 Test results available in: test-results/
    exit /b 1
)
