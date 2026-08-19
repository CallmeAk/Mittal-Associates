function decodeHtml(value = '') {
  return value
    .replace(/<!\[CDATA\[/g, '')
    .replace(/\]\]>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();
}

function stripTags(value = '') {
  return decodeHtml(value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' '));
}

function extract(tag, item) {
  const match = item.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  return match ? decodeHtml(match[1]) : '';
}

function summaryFor(title, topic) {
  const cleanTitle = stripTags(title).replace(/\s+-\s+[^-]+$/g, '').trim();
  return `This update relates to ${String(topic || 'legal developments').toLowerCase()} and may be relevant for businesses, professionals, and individuals tracking Indian legal and regulatory developments. Read the original source for the complete report: ${cleanTitle}`;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=21600, stale-while-revalidate=43200');
  const query = req.query.query || 'Indian law legal update';
  const topic = req.query.topic || 'Legal Updates';
  const feedUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-IN&gl=IN&ceid=IN:en`;
  try {
    const response = await fetch(feedUrl, { headers: { 'User-Agent': 'MittalAssociatesLegalUpdates/1.0' } });
    if (!response.ok) throw new Error(`Google News RSS returned ${response.status}`);
    const xml = await response.text();
    const blocks = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)].slice(0, 12);
    const items = blocks.map((match, index) => {
      const item = match[1];
      const title = stripTags(extract('title', item));
      const link = stripTags(extract('link', item));
      const pubDate = stripTags(extract('pubDate', item));
      const source = stripTags(extract('source', item)) || 'Google News';
      return { id: `${Date.now()}-${index}`, title, link, source, pubDate, topic, summary: summaryFor(title, topic) };
    });
    return res.status(200).json({ items });
  } catch (error) {
    return res.status(200).json({ items: [], error: 'Unable to load legal updates right now.' });
  }
}
