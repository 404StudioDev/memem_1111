# MemeForge - AI-Powered Meme Generator

A modern, feature-rich meme generator with AI-powered caption generation, drag & drop functionality, and secure authentication.

## Features

### 🎨 Core Features
- **Template Library**: 50+ built-in meme templates
- **Custom Upload**: Upload your own images and videos
- **Text Customization**: Full control over fonts, colors, positioning
- **Video Support**: Create memes with video files
- **Instant Download**: High-quality PNG downloads

### 🤖 AI-Powered Features (Premium)
- **AI Caption Generation**: Generate captions in 8 different vibes:
  - Funny 😂
  - Sarcastic 😏
  - Relatable 😅
  - Motivational 💪
  - Parody 🎭
  - Savage 🔥
  - Wholesome 🥰
  - Cringe 😬

### 🎯 Advanced Features (Premium)
- **Drag & Drop Text**: Click and drag text directly on the meme
- **Multiple Text Elements**: Add unlimited text elements
- **Real-time Preview**: See changes instantly
- **Responsive Design**: Works on all devices

### 🔐 Authentication
- Secure authentication with Clerk
- Protected premium features
- User-friendly sign-in flow

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- Clerk account for authentication
- Hugging Face account for AI features (optional)

### 1. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd meme_forge

# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

### 2. Environment Setup

#### Client Environment (.env)
```bash
cd client
cp .env.example .env
```

Edit `client/.env`:
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
VITE_API_URL=http://localhost:3001
```

#### Server Environment (.env)
```bash
cd server
cp .env.example .env
```

Edit `server/.env`:
```env
HF_API_KEY=your_hugging_face_api_key_here
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key_here
PORT=3001
```

### 3. Clerk Setup

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Create a new application
3. Copy your publishable key to `client/.env`
4. Copy your secret key to `server/.env`
5. Configure sign-in methods (email/password recommended)

### 4. Hugging Face Setup (Optional - for AI features)

1. Go to [Hugging Face](https://huggingface.co)
2. Create account and get API token
3. Add token to `server/.env`

### 5. Run the Application

#### Development Mode

Terminal 1 (Server):
```bash
cd server
npm run dev
```

Terminal 2 (Client):
```bash
cd client
npm run dev
```

#### Production Build

```bash
# Build client
cd client
npm run build

# Start server
cd ../server
npm start
```

## API Endpoints

### Public Endpoints
- `GET /health` - Health check

### Protected Endpoints (Require Authentication)
- `POST /generate-captions` - Generate AI captions
- `POST /generate-image` - Generate AI images

## Project Structure

```
meme_forge/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Page components
│   │   ├── utils/         # Utility functions
│   │   └── constants/     # Constants and data
│   └── public/
│       └── images/        # Meme templates
├── server/                # Express backend
│   ├── index.js          # Main server file
│   └── package.json
└── README.md
```

## Usage

### Basic Meme Creation
1. Choose a template or upload your image
2. Edit the text using the Basic tab
3. Customize colors, fonts, and positioning
4. Download your meme

### AI Caption Generation (Premium)
1. Sign in to your account
2. Go to the "AI Caption" tab
3. Enter a topic (e.g., "Monday mornings")
4. Choose a vibe (funny, sarcastic, etc.)
5. Click "Generate 5 Captions"
6. Click any caption to apply it to your meme

### Drag & Drop Text (Premium)
1. Sign in to your account
2. Go to the "Drag & Drop" tab
3. Add new text elements
4. Click and drag text directly on the meme preview
5. Use the controls to customize each text element

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support, please open an issue on GitHub or contact the development team.

---

**Made with ❤️ by MemeForge Team**