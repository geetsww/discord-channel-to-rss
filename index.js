import { Application } from "https://deno.land/x/oak/mod.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";
import "https://deno.land/x/dotenv/load.ts";
const app = new Application();
const endpoint = "https://discord.com/api/v9/channels/235894217048588289/messages?limit=50"


const getRSS = (item) => {
    let content = `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0">
       <channel>
          <title><![CDATA[#cool-links]]></title>
          <description><![CDATA[Flux RSS du channel Discord]]></description>
          <link>https://codinglab.io</link>`

    item.forEach(current => {
        if (current.embeds.length > 0) {
            content = content + `   <item>
        <title><![CDATA[${current.embeds[0].title ?? current.embeds[0].description} (${current.author.username})]]></title>
        <link>${current.embeds[0].url}</link>
        <guid>${current.embeds[0].url}</guid>
        <description><![CDATA[<p>${current.embeds[0].description}</p>]]></description>
        <pubDate>${current.timestamp}</pubDate>
     </item>`
        }
    })

    content = content + `</channel></rss>`
    return content
}

app.use(async (ctx) => {
    const req = await fetch(endpoint, {
        method: 'GET',
        headers: {
            'Authorization': Deno.env.get('TOKEN')
        }
    })
    const data = await req.json()
    ctx.response.headers.set("Content-Type", "application/xml")
    ctx.response.body = getRSS(data);
});

await app.listen({ port: 8000 });


