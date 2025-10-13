# Data Persistence

Learn how to save and manage calibration data across browser sessions.

## Overview

Webgazer.ts can store calibration data locally, allowing users to skip recalibration on return visits. Data is stored using IndexedDB (with localStorage fallback).

::: warning Privacy Considerations
Calibration data may contain biometric information. Always:
- Get explicit user consent before enabling persistence
- Provide clear privacy policies
- Allow users to delete their data
- Consider regulatory requirements (GDPR, CCPA, etc.)
:::

## Basic Usage

### Enable Data Persistence

```typescript
import webgazer from '@webgazer-ts/core';

// Enable before starting
webgazer.saveDataAcrossSessions(true);
await webgazer.begin();

// Data is now automatically saved
```

### Check for Existing Data

```typescript
// Check if calibration data exists
const hasData = await webgazer.hasStoredData();

if (hasData) {
  console.log('Found existing calibration data');
  await webgazer.begin(); // Will load stored data automatically
} else {
  console.log('No calibration data - need to calibrate');
  await runCalibration();
}
```

## Data Management

### Clear Stored Data

```typescript
// Clear all calibration data
await webgazer.clearData();

// Clear and restart
await webgazer.clearData();
await webgazer.begin();
await runCalibration();
```

### Export/Import Data

```typescript
// Export calibration data
const data = await webgazer.getStoredData();
const jsonData = JSON.stringify(data);

// Save to file or send to server
const blob = new Blob([jsonData], { type: 'application/json' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'webgazer-calibration.json';
a.click();

// Import calibration data
async function importCalibrationData(jsonData: string) {
  const data = JSON.parse(jsonData);
  await webgazer.setStoredData(data);
  await webgazer.begin(); // Load imported data
}
```

## Storage Options

### IndexedDB (Default)

Webgazer.ts uses IndexedDB for storage by default:

```typescript
// IndexedDB provides:
// - Large storage capacity (50MB+)
// - Asynchronous operations
// - Structured data storage
```

### localStorage (Fallback)

If IndexedDB is unavailable, localStorage is used:

```typescript
// localStorage limitations:
// - 5-10MB storage limit
// - Synchronous (may block UI)
// - String-only storage
```

## User Consent Flow

Implement proper consent before storing data:

```typescript
async function requestDataPersistence(): Promise<boolean> {
  return new Promise((resolve) => {
    const modal = document.createElement('div');
    modal.innerHTML = `
      <div class="consent-modal">
        <h2>Save Your Calibration?</h2>
        <p>
          We can save your eye tracking calibration to improve 
          your experience on future visits.
        </p>
        <p>
          <strong>Your privacy:</strong>
          <ul>
            <li>Data is stored only on your device</li>
            <li>No data is sent to our servers</li>
            <li>You can delete this data anytime</li>
          </ul>
        </p>
        <div class="consent-actions">
          <button id="consent-accept">Save My Calibration</button>
          <button id="consent-decline">Don't Save</button>
        </div>
        <a href="/privacy" target="_blank">Privacy Policy</a>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector('#consent-accept')?.addEventListener('click', () => {
      modal.remove();
      resolve(true);
    });
    
    modal.querySelector('#consent-decline')?.addEventListener('click', () => {
      modal.remove();
      resolve(false);
    });
  });
}

// Usage
const hasConsent = await requestDataPersistence();
if (hasConsent) {
  webgazer.saveDataAcrossSessions(true);
}
```

## Data Lifecycle

### Complete Example

```typescript
class CalibrationDataManager {
  private readonly CONSENT_KEY = 'webgazer_consent';
  
  async initialize() {
    // Check for existing consent
    const hasConsent = this.getConsent();
    
    if (hasConsent) {
      // User previously consented
      webgazer.saveDataAcrossSessions(true);
      
      if (await webgazer.hasStoredData()) {
        console.log('Loading saved calibration...');
        await webgazer.begin();
      } else {
        console.log('No saved data found, calibrating...');
        await this.calibrate();
      }
    } else {
      // Ask for consent
      const consent = await requestDataPersistence();
      this.setConsent(consent);
      
      if (consent) {
        webgazer.saveDataAcrossSessions(true);
      }
      
      await this.calibrate();
    }
  }
  
  private getConsent(): boolean {
    return localStorage.getItem(this.CONSENT_KEY) === 'true';
  }
  
  private setConsent(consent: boolean) {
    localStorage.setItem(this.CONSENT_KEY, String(consent));
  }
  
  async clearData() {
    await webgazer.clearData();
    this.setConsent(false);
  }
  
  private async calibrate() {
    // Your calibration logic
    await runCalibration();
  }
}

// Usage
const dataManager = new CalibrationDataManager();
await dataManager.initialize();
```

## Multi-User Support

Handle multiple users on the same device:

```typescript
class MultiUserCalibration {
  private currentUser: string | null = null;
  
  async switchUser(userId: string) {
    // Save current user's data
    if (this.currentUser) {
      const data = await webgazer.getStoredData();
      this.saveUserData(this.currentUser, data);
    }
    
    // Load new user's data
    this.currentUser = userId;
    const userData = this.loadUserData(userId);
    
    if (userData) {
      await webgazer.setStoredData(userData);
      await webgazer.begin();
    } else {
      await webgazer.begin();
      await runCalibration();
    }
  }
  
  private saveUserData(userId: string, data: any) {
    const key = `webgazer_user_${userId}`;
    localStorage.setItem(key, JSON.stringify(data));
  }
  
  private loadUserData(userId: string): any | null {
    const key = `webgazer_user_${userId}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }
  
  async deleteUser(userId: string) {
    const key = `webgazer_user_${userId}`;
    localStorage.removeItem(key);
  }
}
```

## Data Expiration

Auto-expire old calibration data:

```typescript
class CalibrationDataWithExpiry {
  private readonly EXPIRY_DAYS = 30;
  private readonly TIMESTAMP_KEY = 'webgazer_timestamp';
  
  async checkExpiry(): Promise<boolean> {
    const timestamp = localStorage.getItem(this.TIMESTAMP_KEY);
    
    if (!timestamp) return true; // No data
    
    const savedDate = new Date(timestamp);
    const now = new Date();
    const daysDiff = (now.getTime() - savedDate.getTime()) / (1000 * 60 * 60 * 24);
    
    if (daysDiff > this.EXPIRY_DAYS) {
      console.log('Calibration data expired, clearing...');
      await webgazer.clearData();
      localStorage.removeItem(this.TIMESTAMP_KEY);
      return true;
    }
    
    return false;
  }
  
  async saveWithTimestamp() {
    webgazer.saveDataAcrossSessions(true);
    localStorage.setItem(this.TIMESTAMP_KEY, new Date().toISOString());
  }
}
```

## Privacy Controls

### User Dashboard

```typescript
function createPrivacyDashboard() {
  return `
    <div class="privacy-dashboard">
      <h3>Your Eye Tracking Data</h3>
      
      <div class="data-info">
        <p><strong>Status:</strong> 
          <span id="data-status">Checking...</span>
        </p>
        <p><strong>Last Updated:</strong> 
          <span id="data-timestamp">Unknown</span>
        </p>
        <p><strong>Storage Size:</strong> 
          <span id="data-size">Calculating...</span>
        </p>
      </div>
      
      <div class="data-actions">
        <button id="export-data">Download My Data</button>
        <button id="delete-data" class="danger">Delete All Data</button>
      </div>
      
      <div class="privacy-info">
        <h4>What We Store</h4>
        <ul>
          <li>Eye tracking calibration parameters</li>
          <li>Regression model weights</li>
          <li>Configuration preferences</li>
        </ul>
        
        <h4>What We DON'T Store</h4>
        <ul>
          <li>Camera images or video</li>
          <li>Personal identifying information</li>
          <li>Browsing history</li>
        </ul>
      </div>
    </div>
  `;
}

// Implement dashboard actions
async function initPrivacyDashboard() {
  const hasData = await webgazer.hasStoredData();
  document.getElementById('data-status')!.textContent = 
    hasData ? 'Active' : 'No data stored';
  
  document.getElementById('export-data')?.addEventListener('click', async () => {
    const data = await webgazer.getStoredData();
    const blob = new Blob([JSON.stringify(data, null, 2)], 
      { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `webgazer-data-${Date.now()}.json`;
    a.click();
  });
  
  document.getElementById('delete-data')?.addEventListener('click', async () => {
    if (confirm('Delete all calibration data? You will need to recalibrate.')) {
      await webgazer.clearData();
      alert('Data deleted successfully');
      location.reload();
    }
  });
}
```

## Best Practices

1. **Always get consent** before storing data
2. **Provide clear privacy information**
3. **Allow easy data deletion**
4. **Implement data expiration**
5. **Don't store unnecessary data**
6. **Test in private/incognito mode**
7. **Handle storage errors gracefully**

## Error Handling

```typescript
try {
  webgazer.saveDataAcrossSessions(true);
  await webgazer.begin();
} catch (error) {
  if (error.name === 'QuotaExceededError') {
    console.error('Storage quota exceeded');
    // Ask user to clear old data or disable persistence
  } else if (error.name === 'SecurityError') {
    console.error('Storage blocked by browser settings');
    // Fall back to session-only mode
  } else {
    console.error('Failed to load stored data:', error);
  }
}
```

## Next Steps

- [Configuration](/guide/core/configuration) - Configure storage settings
- [Privacy Best Practices](/guide/advanced/privacy) - Advanced privacy features
- [API Reference](/api/core/) - Storage API documentation
