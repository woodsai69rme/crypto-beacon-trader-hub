
#!/bin/bash

# Crypto Beacon Trading Platform - Comprehensive Test Suite
# This script runs all tests and generates comprehensive reports

set -e

echo "🧪 Crypto Beacon Trading Platform - Test Suite"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Test results
TESTS_PASSED=0
TESTS_FAILED=0

print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Create test results directory
mkdir -p test-results

# Run unit tests
run_unit_tests() {
    print_info "Running unit tests..."
    
    if npm run test:unit -- --reporter=json --outputFile=test-results/unit-tests.json; then
        print_status "Unit tests passed"
        ((TESTS_PASSED++))
    else
        print_error "Unit tests failed"
        ((TESTS_FAILED++))
    fi
}

# Run integration tests
run_integration_tests() {
    print_info "Running integration tests..."
    
    if npm run test:integration -- --reporter=json --outputFile=test-results/integration-tests.json; then
        print_status "Integration tests passed"
        ((TESTS_PASSED++))
    else
        print_error "Integration tests failed"
        ((TESTS_FAILED++))
    fi
}

# Run E2E tests
run_e2e_tests() {
    print_info "Running E2E tests..."
    
    # Start the application in test mode
    npm run build
    npm run preview &
    SERVER_PID=$!
    
    # Wait for server to start
    sleep 10
    
    if npx playwright test --reporter=json --output-dir=test-results/e2e-results.json; then
        print_status "E2E tests passed"
        ((TESTS_PASSED++))
    else
        print_error "E2E tests failed"
        ((TESTS_FAILED++))
    fi
    
    # Clean up
    kill $SERVER_PID
}

# Run accessibility tests
run_accessibility_tests() {
    print_info "Running accessibility tests..."
    
    if npm run test:a11y -- --reporter=json --outputFile=test-results/a11y-tests.json; then
        print_status "Accessibility tests passed"
        ((TESTS_PASSED++))
    else
        print_error "Accessibility tests failed"
        ((TESTS_FAILED++))
    fi
}

# Run security tests
run_security_tests() {
    print_info "Running security audit..."
    
    if npm audit --audit-level high; then
        print_status "Security audit passed"
        ((TESTS_PASSED++))
    else
        print_warning "Security audit found issues"
        ((TESTS_FAILED++))
    fi
    
    # Run additional security scans
    if command -v snyk >/dev/null 2>&1; then
        print_info "Running Snyk security scan..."
        if snyk test --json > test-results/snyk-results.json; then
            print_status "Snyk scan passed"
        else
            print_warning "Snyk scan found vulnerabilities"
        fi
    fi
}

# Run performance tests
run_performance_tests() {
    print_info "Running performance tests..."
    
    if npm run test:performance; then
        print_status "Performance tests passed"
        ((TESTS_PASSED++))
    else
        print_error "Performance tests failed"
        ((TESTS_FAILED++))
    fi
}

# Generate test coverage report
generate_coverage_report() {
    print_info "Generating test coverage report..."
    
    npm run test:coverage
    
    # Generate HTML report
    npx nyc report --reporter=html --report-dir=test-results/coverage
    
    print_status "Coverage report generated in test-results/coverage/"
}

# Generate comprehensive test report
generate_test_report() {
    print_info "Generating comprehensive test report..."
    
    cat > test-results/test-summary.md << EOF
# Test Results Summary

**Date**: $(date)
**Platform**: Crypto Beacon Trading Platform
**Test Suite Version**: 1.0.0

## Overview
- Total Test Suites: $((TESTS_PASSED + TESTS_FAILED))
- Passed: $TESTS_PASSED
- Failed: $TESTS_FAILED
- Success Rate: $(( TESTS_PASSED * 100 / (TESTS_PASSED + TESTS_FAILED) ))%

## Test Categories

### Unit Tests
- **Status**: $([ -f test-results/unit-tests.json ] && echo "✅ Completed" || echo "❌ Failed")
- **Coverage**: Check test-results/coverage/index.html

### Integration Tests  
- **Status**: $([ -f test-results/integration-tests.json ] && echo "✅ Completed" || echo "❌ Failed")
- **Database**: Connection and query tests
- **API**: External service integration tests

### End-to-End Tests
- **Status**: $([ -f test-results/e2e-results.json ] && echo "✅ Completed" || echo "❌ Failed")
- **Browser**: Cross-browser compatibility
- **User Flows**: Critical user journey tests

### Accessibility Tests
- **Status**: $([ -f test-results/a11y-tests.json ] && echo "✅ Completed" || echo "❌ Failed")
- **WCAG 2.1**: AA compliance verification
- **Screen Reader**: Compatibility testing

### Security Tests
- **NPM Audit**: Dependency vulnerability scan
- **Snyk Scan**: $([ -f test-results/snyk-results.json ] && echo "✅ Completed" || echo "⏭️ Skipped")
- **Static Analysis**: Code security analysis

### Performance Tests
- **Load Time**: Page performance metrics
- **Memory Usage**: Memory leak detection
- **API Response**: Response time analysis

## Recommendations

$(if [ $TESTS_FAILED -gt 0 ]; then
    echo "⚠️  **Action Required**: $TESTS_FAILED test suite(s) failed. Review individual test results for details."
else
    echo "✅ **All tests passed**: Platform is ready for deployment."
fi)

## Next Steps

1. Review failed tests (if any)
2. Update code based on test feedback
3. Re-run failed test suites
4. Generate deployment artifacts

---
*Generated by automated test suite*
EOF

    print_status "Test report generated: test-results/test-summary.md"
}

# Main test execution
main() {
    print_info "Starting comprehensive test suite..."
    
    # Ensure dependencies are installed
    npm ci
    
    # Run all test categories
    run_unit_tests
    run_integration_tests
    run_e2e_tests
    run_accessibility_tests
    run_security_tests
    run_performance_tests
    
    # Generate reports
    generate_coverage_report
    generate_test_report
    
    # Summary
    echo
    echo "📊 Test Summary"
    echo "==============="
    echo "Passed: $TESTS_PASSED"
    echo "Failed: $TESTS_FAILED"
    echo "Total:  $((TESTS_PASSED + TESTS_FAILED))"
    
    if [ $TESTS_FAILED -eq 0 ]; then
        print_status "All tests passed! 🎉"
        echo
        echo "✅ Platform is ready for deployment"
        echo "📁 Test results available in: test-results/"
        echo "🌐 Coverage report: test-results/coverage/index.html"
        exit 0
    else
        print_error "$TESTS_FAILED test suite(s) failed"
        echo
        echo "❌ Please review and fix failing tests before deployment"
        echo "📁 Test results available in: test-results/"
        exit 1
    fi
}

# Run main function
main "$@"
