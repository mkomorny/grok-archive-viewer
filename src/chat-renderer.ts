import { marked } from 'marked';
import DOMPurify from 'dompurify';

export interface ConversationData {
  conversation: {
    id: string;
    title: string;
    create_time: string;
    modify_time: string;
    leaf_response_id: string | null;
  };
  responses: Array<{
    response: {
      _id: string;
      message: string;
      sender: string;
      create_time: { $date: { $numberLong: string } };
      parent_response_id: string | null;
      steps?: Array<{
        tag_order: string[];
        tagged_text: Record<string, string>;
      }>;
    }
  }>;
}

export function renderChat(data: ConversationData, container: HTMLElement) {
  container.innerHTML = ''; // Clear container
  
  const responseMap = new Map<string, any>();
  data.responses.forEach(r => {
    if (r.response && r.response._id) {
      responseMap.set(r.response._id, r.response);
    }
  });

  let currentId = data.conversation.leaf_response_id;
  
  if (!currentId && data.responses.length > 0) {
    const sortedResponses = [...data.responses].sort((a, b) => {
      const timeA = parseInt(a.response.create_time?.$date?.$numberLong || '0');
      const timeB = parseInt(b.response.create_time?.$date?.$numberLong || '0');
      return timeB - timeA;
    });
    currentId = sortedResponses[0].response._id;
  }

  const thread = [];
  while (currentId && responseMap.has(currentId)) {
    const msg = responseMap.get(currentId);
    thread.push(msg);
    currentId = msg.parent_response_id;
  }
  
  thread.reverse();

  if (thread.length === 0) {
    container.innerHTML = '<div class="welcome-screen"><p>No messages found in this conversation.</p></div>';
    return;
  }

  thread.forEach(msg => {
    const wrapper = document.createElement('div');
    wrapper.className = `message-wrapper ${msg.sender === 'human' ? 'human' : 'assistant'}`;

    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${msg.sender === 'human' ? 'human' : 'assistant'}`;

    // If Grok, add the logo
    if (msg.sender === 'assistant') {
      const icon = document.createElement('div');
      icon.className = 'grok-icon';
      icon.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>`;
      msgDiv.appendChild(icon);
    }

    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'message-content-wrapper';
    contentWrapper.style.flex = '1';

    // Thinking steps (if assistant and has steps)
    if (msg.sender === 'assistant' && msg.steps && msg.steps.length > 0) {
      const thinkingSteps = msg.steps.filter((s: any) => s.tagged_text && s.tagged_text.header);
      if (thinkingSteps.length > 0) {
        const details = document.createElement('details');
        details.className = 'thinking-steps';
        
        const summary = document.createElement('summary');
        summary.className = 'thinking-steps-summary';
        summary.textContent = 'Thought process';
        details.appendChild(summary);

        const ul = document.createElement('ul');
        thinkingSteps.forEach((step: any) => {
          const li = document.createElement('li');
          li.textContent = step.tagged_text.header;
          ul.appendChild(li);
        });
        details.appendChild(ul);
        contentWrapper.appendChild(details);
      }
    }

    // Content
    const content = document.createElement('div');
    content.className = 'message-content';
    
    let textMessage = msg.message || '';
    if (msg.sender === 'human' && textMessage.includes('@')) {
      textMessage = textMessage.replace(/@[^@]+@/g, (match: string) => {
        return `*Attached: ${match.replace(/@/g, '')}*\n\n`;
      });
    }

    const rawHtml = marked.parse(textMessage) as string;
    const cleanHtml = DOMPurify.sanitize(rawHtml);
    content.innerHTML = cleanHtml;
    
    contentWrapper.appendChild(content);
    msgDiv.appendChild(contentWrapper);
    
    wrapper.appendChild(msgDiv);
    container.appendChild(wrapper);
  });

  // Scroll to bottom
  container.scrollTop = container.scrollHeight;
}
