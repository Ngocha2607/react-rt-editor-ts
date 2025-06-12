import React, { useState, useRef, useCallback, useEffect } from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import { EyeOpenIcon } from '../../tiptap-icons/eye-open-icon';

interface ResizableImageProps {
  node: any;
  updateAttributes: (attrs: any) => void;
  selected: boolean;
}
interface ImagePreviewModalProps {
  src: string;
  alt?: string;
  onClose: () => void;
}

// Image Preview Modal Component
const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  src,
  alt,
  onClose,
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  return (
    <div
      className="image-preview-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        cursor: 'pointer',
      }}
    >
      <div
        className="image-preview-container"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          maxWidth: '90vw',
          maxHeight: '90vh',
          cursor: 'default',
        }}
      >
        <img
          src={src}
          alt={alt}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            borderRadius: '8px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
          }}
        />

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '-40px',
            right: '0',
            background: 'rgba(255, 255, 255, 0.9)',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#333',
          }}
        >
          ×
        </button>

        {/* Image info */}
        {alt && (
          <div
            style={{
              position: 'absolute',
              bottom: '-40px',
              left: '0',
              right: '0',
              color: 'white',
              textAlign: 'center',
              fontSize: '14px',
              opacity: 0.8,
            }}
          >
            {alt}
          </div>
        )}
      </div>
    </div>
  );
};
export const ResizableImageComponent: React.FC<ResizableImageProps> = ({
  node,
  updateAttributes,
  selected,
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const [aspectRatio, setAspectRatio] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { src, alt, title, width, height } = node.attrs;

  useEffect(() => {
    if (
      imageRef.current &&
      imageRef.current.naturalWidth &&
      imageRef.current.naturalHeight
    ) {
      setAspectRatio(
        imageRef.current.naturalWidth / imageRef.current.naturalHeight,
      );
    }
  }, [src]);

  const handleImageDoubleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowPreview(true);
  }, []);

  const handlePreviewIconClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowPreview(true);
  }, []);

  const closePreview = useCallback(() => {
    setShowPreview(false);
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, direction: string) => {
      e.preventDefault();
      setIsResizing(true);

      const startX = e.clientX;
      const startY = e.clientY;
      const startWidth = width || imageRef.current?.offsetWidth || 0;
      const startHeight = height || imageRef.current?.offsetHeight || 0;

      const handleMouseMove = (e: MouseEvent) => {
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;

        let newWidth = startWidth;
        let newHeight = startHeight;

        switch (direction) {
          case 'se': // Southeast corner
            newWidth = Math.max(50, startWidth + deltaX);
            newHeight = Math.max(50, newWidth / aspectRatio);
            break;
          case 'sw': // Southwest corner
            newWidth = Math.max(50, startWidth - deltaX);
            newHeight = Math.max(50, newWidth / aspectRatio);
            break;
          case 'ne': // Northeast corner
            newWidth = Math.max(50, startWidth + deltaX);
            newHeight = Math.max(50, newWidth / aspectRatio);
            break;
          case 'nw': // Northwest corner
            newWidth = Math.max(50, startWidth - deltaX);
            newHeight = Math.max(50, newWidth / aspectRatio);
            break;
          case 'e': // East side
            newWidth = Math.max(50, startWidth + deltaX);
            newHeight = Math.max(50, newWidth / aspectRatio);
            break;
          case 'w': // West side
            newWidth = Math.max(50, startWidth - deltaX);
            newHeight = Math.max(50, newWidth / aspectRatio);
            break;
        }

        updateAttributes({
          width: Math.round(newWidth),
          height: Math.round(newHeight),
        });
      };

      const handleMouseUp = () => {
        setIsResizing(false);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [width, height, aspectRatio, updateAttributes],
  );

  const resizeHandles = [
    { position: 'nw', cursor: 'nw-resize' },
    { position: 'ne', cursor: 'ne-resize' },
    { position: 'sw', cursor: 'sw-resize' },
    { position: 'se', cursor: 'se-resize' },
    { position: 'w', cursor: 'w-resize' },
    { position: 'e', cursor: 'e-resize' },
  ];

  return (
    <React.Fragment>
      <NodeViewWrapper className="resizable-image-wrapper">
        <div
          ref={containerRef}
          className={`resizable-image-container ${selected ? 'selected' : ''}`}
          style={{
            position: 'relative',
            display: 'inline-block',
            maxWidth: '100%',
          }}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <img
            ref={imageRef}
            src={src}
            alt={alt}
            title={title}
            width={width}
            height={height}
            style={{
              maxWidth: '100%',
              height: 'auto',
              display: 'block',
              cursor: 'pointer',
              transition: 'opacity 0.2s ease',
            }}
            onLoad={() => {
              if (imageRef.current) {
                setAspectRatio(
                  imageRef.current.naturalWidth /
                    imageRef.current.naturalHeight,
                );
              }
            }}
            onDoubleClick={handleImageDoubleClick}
          />

          {/* Preview Icon */}
          {(isHovering || selected) && (
            <div
              className="preview-icon"
              onClick={handlePreviewIconClick}
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                width: '28px',
                height: '28px',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'white',
                fontSize: '14px',
                transition: 'all 0.2s ease',
                zIndex: 5,
              }}
              title="Preview image (or double-click)"
            >
              <EyeOpenIcon />
            </div>
          )}
          {selected && (
            <>
              {resizeHandles.map(({ position, cursor }) => (
                <div
                  key={position}
                  className={`resize-handle resize-handle-${position}`}
                  style={{
                    position: 'absolute',
                    width: '8px',
                    height: '8px',
                    backgroundColor: '#007bff',
                    border: '1px solid #fff',
                    borderRadius: '2px',
                    cursor,
                    zIndex: 10,
                    ...getHandlePosition(position),
                  }}
                  onMouseDown={(e) => handleMouseDown(e, position)}
                />
              ))}
            </>
          )}
        </div>

        <style>{`
        .resizable-image-wrapper {
          display: inline-block;
          max-width: 100%;
        }
        
        .resizable-image-container.selected {
          outline: 2px solid #007bff;
          outline-offset: 2px;
        }
        
        .resize-handle {
          user-select: none;
        }
        
        .resize-handle:hover {
          background-color: #0056b3;
        }
        .preview-icon:hover {
        background-color: rgba(0, 0, 0, 0.9);
        transform: scale(1.1);
        }
      `}</style>
      </NodeViewWrapper>
      {showPreview && (
        <ImagePreviewModal src={src} alt={alt} onClose={closePreview} />
      )}
    </React.Fragment>
  );
};

function getHandlePosition(position: string) {
  const offset = -4; // Half of handle size

  switch (position) {
    case 'nw':
      return { top: offset, left: offset };
    case 'ne':
      return { top: offset, right: offset };
    case 'sw':
      return { bottom: offset, left: offset };
    case 'se':
      return { bottom: offset, right: offset };
    case 'w':
      return { top: '50%', left: offset, transform: 'translateY(-50%)' };
    case 'e':
      return { top: '50%', right: offset, transform: 'translateY(-50%)' };
    default:
      return {};
  }
}
