import Image from 'next/image'

export function Logo({
  className = '',
}: {
  className?: string
  invert?: boolean
}) {
  return (
    <div className={`flex items-center ${className}`}>
      <Image
        src="/kaaj-logo.png"
        alt="KAAJ Dental Clinic"
        width={180}
        height={100}
        priority
        className="h-auto w-[150px] object-contain"
      />
    </div>
  )
}