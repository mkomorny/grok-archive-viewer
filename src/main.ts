import { renderChat, type ConversationData } from './chat-renderer';

interface GrokExport {
  conversations: ConversationData[];
}

// @ts-ignore
const electronAPI = window.electronAPI;

let allConversations: ConversationData[] = [];
let activeConversationId: string | null = null;

async function init() {
  const exportListEl = document.getElementById('export-list');

  if (electronAPI) {
    try {
      const exports = await electronAPI.getExports();
      
      if (exports.length === 0) {
        if (exportListEl) {
          exportListEl.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No exports found in the exports/ folder.</p>';
        }
      } else if (exports.length === 1) {
        // Auto load if only one
        loadExport(exports[0].path);
      } else {
        // Show selector
        exports.forEach((exp: any) => {
          const item = document.createElement('div');
          item.className = 'export-item';
          item.innerHTML = `
            <svg class="export-item-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
              <polyline points="13 2 13 9 20 9"></polyline>
            </svg>
            <span>${exp.name}</span>
          `;
          item.onclick = () => loadExport(exp.path);
          if (exportListEl) exportListEl.appendChild(item);
        });
      }
    } catch (err) {
      console.error(err);
      if (exportListEl) exportListEl.innerHTML = `<p style="color: red;">Error: ${err}</p>`;
    }
  } else {
    // Fallback for non-electron env (e.g. browser dev)
    loadExport('/data/data.json', true);
  }
}

async function loadExport(filePath: string, isFetch = false) {
  const exportSelector = document.getElementById('export-selector');
  const appContainer = document.getElementById('app');
  const chatContainer = document.getElementById('chat-container');
  
  if (exportSelector) exportSelector.style.display = 'none';
  if (appContainer) appContainer.style.display = 'flex';
  
  if (chatContainer) {
    chatContainer.innerHTML = '<div class="welcome-screen"><p>Loading data...</p></div>';
  }

  try {
    let data: GrokExport;
    if (isFetch) {
      const res = await fetch(filePath);
      data = await res.json();
    } else {
      data = await electronAPI.readExport(filePath);
    }
    
    allConversations = data.conversations.sort((a, b) => {
      const timeA = new Date(a.conversation.modify_time).getTime();
      const timeB = new Date(b.conversation.modify_time).getTime();
      return timeB - timeA;
    });

    renderSidebar(allConversations);
    
    if (chatContainer) {
      chatContainer.innerHTML = `
        <div class="welcome-screen">
          <svg class="grok-splash-logo" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          <p>Select a conversation from the sidebar to view it.</p>
        </div>
      `;
    }

  } catch (err) {
    console.error('Error loading data:', err);
    if (chatContainer) {
      chatContainer.innerHTML = `
        <div class="welcome-screen">
          <p style="color: red;">Error loading data.</p>
        </div>
      `;
    }
  }
}

function renderSidebar(conversations: ConversationData[]) {
  const listEl = document.getElementById('conversation-list');
  if (!listEl) return;

  listEl.innerHTML = '';

  conversations.forEach(data => {
    const item = document.createElement('div');
    item.className = `conversation-item ${data.conversation.id === activeConversationId ? 'active' : ''}`;
    
    item.textContent = data.conversation.title || 'Untitled Conversation';
    
    item.addEventListener('click', () => {
      document.querySelectorAll('.conversation-item').forEach(el => el.classList.remove('active'));
      item.classList.add('active');
      selectConversation(data);
    });

    listEl.appendChild(item);
  });
}

function selectConversation(data: ConversationData) {
  activeConversationId = data.conversation.id;
  const container = document.getElementById('chat-container');
  
  if (container) {
    renderChat(data, container);
  }
}

document.addEventListener('DOMContentLoaded', init);
