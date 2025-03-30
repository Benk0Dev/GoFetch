import { Router, Request, Response } from 'express';
import { getChatsForUser, getChatById, addMessage, createChat } from '@server/static/MessageStatic';

const router = Router();

// Get messages for a user
router.get('/chats/:userId', (req: Request, res: Response) => {
    const result = getChatsForUser(parseInt(req.params.userId))
    res.json(result);
});

// Get chat by ID
router.get('/chat/:chatId', (req: Request, res: Response) => {
    const result = getChatById(parseInt(req.params.chatId));
    res.json(result);
});

// Add message to a chat
router.post('/chat/message', (req: Request, res: Response): void => {
  try {
    console.log('Received message request via HTTP:', req.body);
    
    // Make sure chatId and message are provided
    if (!req.body.chatId || !req.body.message) {
      res.status(400).json({ 
        success: false, 
        error: 'Missing chatId or message data' 
      });
      return;
    }
    
    // Call the same addMessage function that the WebSocket uses
    const result = addMessage(req.body.chatId, req.body.message);
    
    // The message is emitted in the addMessage function,
    // so we don't need to emit it again here
    
    res.json(result);
  } catch (error) {
    console.error('Error in chat message endpoint:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send message' 
    });
  }
});

// Create a new chat
router.post('/chat/create', (req, res) => {
    res.json(createChat(req.body));
});

export default router;
