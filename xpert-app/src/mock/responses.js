export const mockResponses = {
  1: `## Code Solution

Here's the implementation you requested:

\`\`\`javascript
function fibonacci(n) {
  if (n <= 1) return n;

  let prev = 0, curr = 1;
  for (let i = 2; i <= n; i++) {
    [prev, curr] = [curr, prev + curr];
  }
  return curr;
}

// Usage
console.log(fibonacci(10)); // 55
console.log(fibonacci(20)); // 6765
\`\`\`

### Explanation
- **Time Complexity**: O(n) - iterates through the sequence once
- **Space Complexity**: O(1) - uses only two variables
- This iterative approach is more efficient than the recursive version which has O(2^n) complexity

### Improvements
1. Add input validation for negative numbers
2. Consider using BigInt for very large numbers
3. Memoization could be added for repeated calls`,

  2: `## The Future of Remote Work: How Companies Are Adapting in 2026

The landscape of work has fundamentally shifted. What began as a necessity has evolved into a strategic advantage for forward-thinking organizations.

### The Current State

Remote work is no longer an experiment — it's the default for 67% of knowledge workers globally. Companies that embraced this shift early are now reaping the benefits of access to global talent pools, reduced overhead costs, and increased employee satisfaction.

### Key Trends

**1. Hybrid-First Design**
The most successful companies aren't choosing between remote and in-office. They're designing workspaces and workflows that accommodate both seamlessly.

**2. Asynchronous Communication**
Real-time meetings are being replaced by thoughtful, documented async communication. This shift respects time zones and deep work periods.

**3. Results Over Hours**
Progressive organizations measure output and impact rather than time spent at a desk. This fundamental shift in management philosophy has driven productivity gains of 20-30%.

### Conclusion

The companies that will thrive are those that view remote work not as a perk, but as a core operational strategy.`,

  3: `## SWOT Analysis: TechStart AI Platform

### Strengths
- **First-mover advantage** in AI-powered prompt generation for SMBs
- Strong technical team with deep ML expertise
- Scalable cloud infrastructure with low marginal costs
- Growing user base with 85% month-over-month retention

### Weaknesses
- Limited brand recognition outside early adopter segment
- Dependency on third-party AI model providers
- Small sales team for enterprise segment
- Documentation and onboarding need improvement

### Opportunities
- Enterprise market largely untapped ($45B TAM)
- API partnerships with major SaaS platforms
- Vertical-specific solutions (legal, healthcare, finance)
- International expansion — strong demand in EU and APAC

### Threats
- Big tech companies entering the space (Google, Microsoft)
- Regulatory changes around AI usage and data privacy
- Open-source alternatives gaining traction
- Economic downturn could reduce technology spending

### Recommendations
1. Prioritize enterprise sales with dedicated account managers
2. Diversify AI model providers to reduce vendor lock-in
3. Invest in vertical solutions starting with legal tech`,

  4: `## Document Analysis Summary

### Key Findings

The document contains **42 pages** covering Q4 2025 financial performance. Here are the extracted insights:

**Revenue Highlights**
- Total revenue: $12.4M (up 23% YoY)
- SaaS recurring revenue: $8.7M (70% of total)
- Professional services: $3.7M

**Cost Analysis**
- Operating expenses increased 15% to $9.2M
- R&D spending: $3.1M (34% of expenses)
- Customer acquisition cost: $142 (down from $178)

**Key Metrics**
| Metric | Q4 2025 | Q3 2025 | Change |
|--------|---------|---------|--------|
| MRR | $2.9M | $2.5M | +16% |
| Churn Rate | 3.2% | 4.1% | -0.9% |
| NPS Score | 72 | 68 | +4 |

### Action Items
1. Continue investment in product-led growth
2. Address enterprise churn in EMEA region
3. Accelerate hiring in engineering`,

  5: `## Translation Result

### Original (English)
"The quarterly results exceeded our expectations, driven by strong demand in the enterprise segment and improved operational efficiency across all departments."

### Translation (Spanish)
"Los resultados trimestrales superaron nuestras expectativas, impulsados por la fuerte demanda en el segmento empresarial y la mejora de la eficiencia operativa en todos los departamentos."

### Translation Notes
- "exceeded expectations" → "superaron nuestras expectativas" (formal business register maintained)
- "enterprise segment" → "segmento empresarial" (standard business terminology in Latin American Spanish)
- "operational efficiency" → "eficiencia operativa" (universally understood in all Spanish-speaking regions)

### Confidence: 98%
The translation maintains the formal business tone of the original while using terminology standard across Spanish-speaking markets.`,
};

export function getMockResponse(agentId) {
  return mockResponses[agentId] || 'Response generated successfully. This is a placeholder response for this agent.';
}
