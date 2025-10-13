/**
 * UMD Wrapper for Drop-in Replacement Compatibility
 * 
 * This file ensures that when loaded as a UMD script, the default export
 * (webgazer instance) is directly assigned to window.webgazer, making it
 * compatible with code expecting the original webgazer.js API.
 */

// Import the default webgazer instance
import webgazerInstance from './index';

// Export the default for UMD
export default webgazerInstance;
