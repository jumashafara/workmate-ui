# Chatbot Component

A modern, responsive chatbot interface for the Workmate application built with Material-UI components.

## Features

- Clean, modern UI with responsive design using Material-UI components
- User and bot avatars for better visual distinction
- Typing indicators to show when the bot is preparing a response
- Animated message bubbles for a more dynamic feel
- Basic response intelligence based on user input keywords
- Dark mode support through MUI theming
- Accessibility-friendly design with proper ARIA attributes

## Usage

Import and use the component in your application:

```tsx
import Chatbot from './components/Chat/Chatbot';

function App() {
  return (
    <div className="app">
      <Chatbot />
    </div>
  );
}
```

## Customization

The chatbot component uses Material-UI for styling. You can customize the appearance by:

1. Using MUI's theming system to adjust colors, typography, and spacing
2. Modifying the component's styling through the `sx` prop
3. Replacing the avatar images with your own
4. Extending the component with additional MUI components

## Bot Responses

The bot responses are currently handled by the `getBotResponse` function which uses simple keyword matching. For more advanced functionality, you can:

1. Integrate with a backend API for more intelligent responses
2. Implement a more sophisticated NLP solution
3. Connect to a third-party chatbot service

## MUI Components Used

- `Card`, `CardHeader`, `CardContent` - For the main container and layout
- `Avatar` - For user and bot profile images
- `Typography` - For text elements with proper hierarchy
- `TextField` - For the message input with adornments
- `IconButton` - For interactive buttons
- `Paper` - For message bubbles
- `Divider` - For visual separation
- `Box` - For layout containers
- `Tooltip` - For improved usability

## Future Enhancements

- Message history persistence
- File and image sharing capabilities
- Voice input/output
- Integration with backend services for dynamic data retrieval
- User feedback mechanisms (thumbs up/down on responses)
- Rich text formatting in messages 