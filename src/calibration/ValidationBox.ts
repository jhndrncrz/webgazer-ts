/**
 * Validation Box
 * Provides visual feedback for face position validation during calibration
 */

import type {
  ValidationBoxConfiguration,
  FaceValidationStatus,
} from './types';
import type { Rectangle } from '../types/geometry';
import { DOMManager } from '../utils/browser/DOMManager';

/**
 * ValidationBox class
 * Renders a box that validates face position and provides visual feedback
 */
export class ValidationBox {
  private config: ValidationBoxConfiguration;
  private container: HTMLDivElement | null = null;
  private boxElement: HTMLDivElement | null = null;
  private instructionElement: HTMLDivElement | null = null;
  private isInitialized: boolean = false;
  private currentStatus: FaceValidationStatus | null = null;

  /**
   * Create a new ValidationBox
   * @param config - Validation box configuration
   */
  constructor(config: ValidationBoxConfiguration) {
    this.config = { ...config };
  }

  /**
   * Initialize the validation box
   */
  public initialize(): void {
    if (this.isInitialized) {
      return;
    }

    // Get or create container
    let parentContainer = DOMManager.getElementById(this.config.containerId);
    if (!parentContainer) {
      parentContainer = DOMManager.createElement('div', {
        id: this.config.containerId,
        styles: {
          position: 'relative',
          width: '100%',
          height: '100%',
        },
      });
      DOMManager.appendToBody(parentContainer);
    }

    // Create validation box container
    this.container = DOMManager.createElement('div', {
      styles: {
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: '1000',
      },
    });

    // Create validation box
    this.boxElement = DOMManager.createElement('div', {
      id: this.config.boxId,
      styles: {
        position: 'absolute',
        border: '3px solid',
        borderColor: this.config.colors.invalid,
        boxSizing: 'border-box',
        pointerEvents: 'none',
      },
    });

    this.container.appendChild(this.boxElement);

    // Create instruction text if enabled
    if (this.config.showInstructions) {
      this.instructionElement = DOMManager.createElement('div', {
        styles: {
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '10px 20px',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          borderRadius: '5px',
          fontSize: '14px',
          fontFamily: 'Arial, sans-serif',
          textAlign: 'center',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
        },
      });
      this.instructionElement.textContent = this.config.instructionText;
      this.container.appendChild(this.instructionElement);
    }

    parentContainer.appendChild(this.container);
    this.updateBoxPosition();
    this.isInitialized = true;
  }

  /**
   * Update validation status and visual feedback
   * @param status - Face validation status
   */
  public updateStatus(status: FaceValidationStatus): void {
    if (!this.boxElement) {
      return;
    }

    this.currentStatus = status;

    // Update box color based on validation status
    let color: string;
    if (status.isValid) {
      color = this.config.colors.valid;
    } else if (status.isCentered || status.isCorrectDistance) {
      color = this.config.colors.warning;
    } else {
      color = this.config.colors.invalid;
    }

    DOMManager.applyStyles(this.boxElement, {
      borderColor: color,
    });

    // Update instruction text
    if (this.instructionElement && this.config.showInstructions) {
      this.instructionElement.textContent = status.message;
    }
  }

  /**
   * Update validation box based on face detection
   * @param faceBox - Detected face bounding box (optional)
   */
  public updateFromFaceBox(faceBox?: Rectangle): void {
    if (!faceBox) {
      this.updateStatus({
        isValid: false,
        isCentered: false,
        isCorrectDistance: false,
        message: 'Please position your face in the frame',
      });
      return;
    }

    const validationBox = this.getValidationBoxBounds();
    
    // Check if face is centered
    const faceCenterX = faceBox.x + faceBox.width / 2;
    const faceCenterY = faceBox.y + faceBox.height / 2;
    const boxCenterX = validationBox.x + validationBox.width / 2;
    const boxCenterY = validationBox.y + validationBox.height / 2;

    const centerThreshold = 50; // pixels
    const isCentered =
      Math.abs(faceCenterX - boxCenterX) < centerThreshold &&
      Math.abs(faceCenterY - boxCenterY) < centerThreshold;

    // Check if face is correct distance (based on face size relative to box)
    const faceArea = faceBox.width * faceBox.height;
    const boxArea = validationBox.width * validationBox.height;
    const sizeRatio = faceArea / boxArea;
    const isCorrectDistance = sizeRatio > 0.3 && sizeRatio < 0.8;

    // Check if face is within validation box
    const isWithinBox =
      faceBox.x >= validationBox.x &&
      faceBox.y >= validationBox.y &&
      faceBox.x + faceBox.width <= validationBox.x + validationBox.width &&
      faceBox.y + faceBox.height <= validationBox.y + validationBox.height;

    const isValid = isCentered && isCorrectDistance && isWithinBox;

    let message: string;
    if (isValid) {
      message = 'Perfect! Face position is good';
    } else if (!isCentered) {
      message = 'Please center your face in the box';
    } else if (!isCorrectDistance) {
      message = sizeRatio < 0.3
        ? 'Please move closer to the camera'
        : 'Please move back from the camera';
    } else {
      message = 'Please adjust your position';
    }

    this.updateStatus({
      isValid,
      isCentered,
      isCorrectDistance,
      message,
    });
  }

  /**
   * Get validation box bounds
   * @returns Validation box rectangle
   */
  private getValidationBoxBounds(): Rectangle {
    if (!this.container) {
      return { x: 0, y: 0, width: 0, height: 0 };
    }

    const containerRect = this.container.getBoundingClientRect();
    const boxWidth = containerRect.width * this.config.ratio;
    const boxHeight = containerRect.height * this.config.ratio;
    const boxX = (containerRect.width - boxWidth) / 2;
    const boxY = (containerRect.height - boxHeight) / 2;

    return {
      x: boxX,
      y: boxY,
      width: boxWidth,
      height: boxHeight,
    };
  }

  /**
   * Update box position based on ratio
   */
  private updateBoxPosition(): void {
    if (!this.boxElement || !this.container) {
      return;
    }

    const bounds = this.getValidationBoxBounds();

    DOMManager.applyStyles(this.boxElement, {
      left: `${bounds.x}px`,
      top: `${bounds.y}px`,
      width: `${bounds.width}px`,
      height: `${bounds.height}px`,
    });
  }

  /**
   * Set visibility
   * @param visible - Whether box should be visible
   */
  public setVisible(visible: boolean): void {
    if (this.container) {
      DOMManager.setVisible(this.container, visible);
    }
  }

  /**
   * Set instruction text
   * @param text - Instruction text to display
   */
  public setInstructionText(text: string): void {
    this.config.instructionText = text;
    if (this.instructionElement) {
      this.instructionElement.textContent = text;
    }
  }

  /**
   * Get current validation status
   * @returns Current validation status or null
   */
  public getCurrentStatus(): FaceValidationStatus | null {
    return this.currentStatus;
  }

  /**
   * Update configuration
   * @param config - Partial configuration to update
   */
  public updateConfig(config: Partial<ValidationBoxConfiguration>): void {
    this.config = { ...this.config, ...config };

    if (config.ratio !== undefined) {
      this.updateBoxPosition();
    }

    if (config.showInstructions !== undefined && this.instructionElement) {
      DOMManager.setVisible(this.instructionElement, config.showInstructions);
    }

    if (config.instructionText !== undefined) {
      this.setInstructionText(config.instructionText);
    }
  }

  /**
   * Destroy the validation box
   */
  public destroy(): void {
    if (this.container && this.container.parentNode) {
      DOMManager.removeElement(this.container);
    }

    this.container = null;
    this.boxElement = null;
    this.instructionElement = null;
    this.currentStatus = null;
    this.isInitialized = false;
  }
}
