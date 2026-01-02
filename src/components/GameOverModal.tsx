import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { formatFractionalInches } from '../utils/fractionalInches'
import './GameOverModal.css'

interface GameOverModalProps {
  isOpen: boolean
  onClose: () => void
  hasWon: boolean
  answer: number
  onNewGame: () => void
}

export default function GameOverModal({
  isOpen,
  onClose,
  hasWon,
  answer,
  onNewGame,
}: GameOverModalProps) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="modal-dialog">
      {/* Backdrop */}
      <div className="modal-backdrop" aria-hidden="true" />

      {/* Modal panel */}
      <div className="modal-container">
        <DialogPanel className="modal-panel">
          {/* Close button */}
          <button
            onClick={onClose}
            className="modal-close-button"
            aria-label="Close"
          >
            ✕
          </button>

          {/* Title */}
          <DialogTitle className="modal-title">
            Game Over!
          </DialogTitle>

          {/* Win/loss message */}
          <p className="modal-message">
            {hasWon ? "🎉 You got it!" : "😔 Better luck next time!"}
          </p>

          {/* Answer reveal */}
          <p className="modal-answer">
            The answer was <strong>{formatFractionalInches(answer)}</strong>
          </p>

          {/* New game button */}
          <button onClick={onNewGame} className="modal-new-line-button">
            🔄 New Line
          </button>
        </DialogPanel>
      </div>
    </Dialog>
  )
}
