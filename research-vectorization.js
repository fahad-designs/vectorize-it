import ZAI from 'z-ai-web-dev-sdk';

async function performResearch() {
  const zai = await ZAI.create();

  console.log('='.repeat(80));
  console.log('RESEARCH 1: Best Image Vectorization Algorithms and Methods');
  console.log('='.repeat(80));

  const vectorizationAlgorithms = await zai.functions.invoke('web_search', {
    query: 'best image to SVG vectorization algorithms potrace imagetracerjs 2024',
    num: 10
  });

  console.log('\n--- Vectorization Algorithms Results ---');
  vectorizationAlgorithms.forEach((item, i) => {
    console.log(`\n${i + 1}. ${item.name}`);
    console.log(`   URL: ${item.url}`);
    console.log(`   ${item.snippet}`);
  });

  console.log('\n' + '='.repeat(80));
  console.log('RESEARCH 2: High-Quality Vectorization Methods');
  console.log('='.repeat(80));

  const highQualityMethods = await zai.functions.invoke('web_search', {
    query: 'high quality image vectorization techniques SVG best methods',
    num: 10
  });

  console.log('\n--- High-Quality Vectorization Methods Results ---');
  highQualityMethods.forEach((item, i) => {
    console.log(`\n${i + 1}. ${item.name}`);
    console.log(`   URL: ${item.url}`);
    console.log(`   ${item.snippet}`);
  });

  console.log('\n' + '='.repeat(80));
  console.log('RESEARCH 3: Competitor Analysis - Online Vectorization Tools');
  console.log('='.repeat(80));

  const competitors = await zai.functions.invoke('web_search', {
    query: 'online image to SVG converter vectorizer tools comparison',
    num: 10
  });

  console.log('\n--- Competitor Websites Results ---');
  competitors.forEach((item, i) => {
    console.log(`\n${i + 1}. ${item.name}`);
    console.log(`   URL: ${item.url}`);
    console.log(`   ${item.snippet}`);
  });

  console.log('\n' + '='.repeat(80));
  console.log('RESEARCH 4: SEO Keywords for Image Vectorization');
  console.log('='.repeat(80));

  const seoKeywords = await zai.functions.invoke('web_search', {
    query: 'SEO keywords image to SVG converter vectorization tool',
    num: 10
  });

  console.log('\n--- SEO Keywords Results ---');
  seoKeywords.forEach((item, i) => {
    console.log(`\n${i + 1}. ${item.name}`);
    console.log(`   URL: ${item.url}`);
    console.log(`   ${item.snippet}`);
  });

  console.log('\n' + '='.repeat(80));
  console.log('RESEARCH 5: LSI Keywords and Long-tail Keywords');
  console.log('='.repeat(80));

  const lsiKeywords = await zai.functions.invoke('web_search', {
    query: 'raster to vector conversion keywords SVG optimization terms',
    num: 10
  });

  console.log('\n--- LSI Keywords Results ---');
  lsiKeywords.forEach((item, i) => {
    console.log(`\n${i + 1}. ${item.name}`);
    console.log(`   URL: ${item.url}`);
    console.log(`   ${item.snippet}`);
  });

  console.log('\n' + '='.repeat(80));
  console.log('RESEARCH 6: Advanced Vectorization Techniques');
  console.log('='.repeat(80));

  const advancedTech = await zai.functions.invoke('web_search', {
    query: 'advanced image vectorization machine learning AI SVG generation',
    num: 10
  });

  console.log('\n--- Advanced Vectorization Techniques Results ---');
  advancedTech.forEach((item, i) => {
    console.log(`\n${i + 1}. ${item.name}`);
    console.log(`   URL: ${item.url}`);
    console.log(`   ${item.snippet}`);
  });

  // Compile all research into a structured summary
  const researchSummary = {
    timestamp: new Date().toISOString(),
    vectorizationAlgorithms: vectorizationAlgorithms.map(r => ({
      title: r.name,
      url: r.url,
      snippet: r.snippet,
      domain: r.host_name
    })),
    highQualityMethods: highQualityMethods.map(r => ({
      title: r.name,
      url: r.url,
      snippet: r.snippet,
      domain: r.host_name
    })),
    competitors: competitors.map(r => ({
      title: r.name,
      url: r.url,
      snippet: r.snippet,
      domain: r.host_name
    })),
    seoKeywords: seoKeywords.map(r => ({
      title: r.name,
      url: r.url,
      snippet: r.snippet,
      domain: r.host_name
    })),
    lsiKeywords: lsiKeywords.map(r => ({
      title: r.name,
      url: r.url,
      snippet: r.snippet,
      domain: r.host_name
    })),
    advancedTech: advancedTech.map(r => ({
      title: r.name,
      url: r.url,
      snippet: r.snippet,
      domain: r.host_name
    }))
  };

  console.log('\n' + '='.repeat(80));
  console.log('RESEARCH COMPLETE - Summary saved to console');
  console.log('='.repeat(80));

  return researchSummary;
}

// Run research
performResearch()
  .then(summary => {
    console.log('\n\nResearch Summary Generated Successfully!');
    console.log('Total Sources Analyzed:');
    console.log(`- Vectorization Algorithms: ${summary.vectorizationAlgorithms.length}`);
    console.log(`- High-Quality Methods: ${summary.highQualityMethods.length}`);
    console.log(`- Competitors: ${summary.competitors.length}`);
    console.log(`- SEO Keywords: ${summary.seoKeywords.length}`);
    console.log(`- LSI Keywords: ${summary.lsiKeywords.length}`);
    console.log(`- Advanced Tech: ${summary.advancedTech.length}`);
  })
  .catch(error => {
    console.error('Research failed:', error);
    process.exit(1);
  });
