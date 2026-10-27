let http = require('http');
let fs = require('fs');
let path = require('path');

const PORT = 3000;

const uploadDir = path.join(__dirname, 'uploads');

const messages = [
    'Hello there!',
    'Have a great day!',
    'Node.js is running!',
    'Greetings from the server!',
    'Random message number five!'
];

const server = http.createServer((req, res) => {
  console.log("Request data:", req.method, req.url);
  if (req.url == "/image" && req.method == "POST") handleImage_POST(req, res);
  if (req.url == "/image" && req.method == "GET") handleImage_GET(req, res); 
  else if (req.url == "/text" && req.method == "POST") handleText_POST(req, res); 
  else if (req.url == "/text" && req.method == "GET") handleText_GET(req, res); 
  else if (req.url == "/") {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end("Hello World!");
  }
  else {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end("Endpoint not found!");
  }
});

server.listen(PORT, () => {
  console.log("Server is listening on port", PORT);
});

// POST /image
function handleImage_POST(req, res) {
  const chunks = [];
    let size = 0;
    const maxSize = 5 * 1024 * 1024; // 5 MB

    req.on('data', chunk => {
        size += chunk.length;

        if (size > maxSize) {
            res.writeHead(413);
            res.end('Image too large (max 5 MB)');
            req.destroy();
            return;
        }

        chunks.push(chunk);
    });

    req.on('end', () => {
        const image = Buffer.concat(chunks);

        // Create the uploads folder if it doesn't exist
        fs.mkdirSync('uploads', { recursive: true });

        const filename = `image-${Date.now()}.png`;
        fs.writeFileSync(uploadDir, image);

        console.log(`Image received: ${filename}`);

        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Image received successfully!');
    });
}

// GET /image
function handleImage_GET(req, res) {
  if (!fs.existsSync(uploadDir)) {
      res.writeHead(404);
      return res.end('No images uploaded yet');
  }

  const images = fs.readdirSync(uploadDir).filter(file => file.endsWith('.png'));

  if (images.length === 0) {
      res.writeHead(404);
      return res.end('No images uploaded yet');
  }

  const randomImage = images[Math.floor(Math.random() * images.length)];

  const imagePath = path.join(uploadDir, randomImage);
  const image = fs.readFileSync(imagePath);

  res.writeHead(200, {
      'Content-Type': 'image/png'
  });
  return res.end(image);
}

// POST /text
function handleText_POST(req, res) {
  let text = '';
  req.setEncoding('utf8');

  req.on('data', chunk => {
      text += chunk;
      messages.push(text);
  });

  req.on('end', () => {
      console.log('Text received:', text);

      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Text received successfully!');
  });
}

// GET /text
function handleText_GET(req, res) {
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];
  res.writeHead(200, {
      'Content-Type': 'text/plain; charset=utf-8'
  });
  return res.end(randomMessage);
}