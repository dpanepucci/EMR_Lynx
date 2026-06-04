import './hamburgerMenu.css'

export default function Hamburger ({ isOpen }) {
  return (
    <>
      <div id='hamburgerMenu' className={isOpen ? 'open' : ''}>
        <div className='burger' />
        <div className='burger' />
        <div className='burger' />
      </div>
    </>
  )
}
