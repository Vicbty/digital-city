import { QRCodeSVG } from 'qrcode.react'

export default function QrModal({ onClose }: { onClose: () => void }) {
  const url = window.location.origin
  return (
    <div className="modal" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="qr-panel" onClick={(e) => e.stopPropagation()}>
        <h2 className="title-sm">Scanne et joue ! 📱</h2>
        <div className="qr-box">
          <QRCodeSVG value={url} size={Math.min(320, window.innerWidth - 80)} level="M" />
        </div>
        <p className="muted">{url.replace(/^https?:\/\//, '')}</p>
        <button className="btn btn-ghost" onClick={onClose}>
          Fermer
        </button>
      </div>
    </div>
  )
}
