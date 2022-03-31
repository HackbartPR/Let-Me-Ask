//BIBLIOTECAS
import React from 'react'
//ICONS/IMAGES
import '../assets/fonts-icons/style.css'
//ESTILIZAÇÃO
import '../styles/cards.scss'


function Cards ({isHighlighted, content, author, handleCheckQuestionAsAnswered, handleHighlightQuestion, handleDeleteQuestion, countLikes, handleInsertLike, likeID, isAdmin, isAnswered}) {

  return(
    
    <div className={`divCards__container flex ${isHighlighted ? ('isHighlighted'):('') } ${isAnswered ? ('isAnswered'):('')}`} >
      <div className='divCards__text flex'>{content}</div>
      <div className='divCards__footer flex'>
        <div className='divCards__footer__user flex'>
          <img className='divCards__img' src={author.avatar} />
          <span className='divCards__userName'>{author.name}</span>
        </div>
        

        {isAdmin ? (
          <div className='divCards__footer__functions flex'>
            
            {!isAnswered && (
              <React.StrictMode>
                <i className={`icons icon-check-circle ${isAnswered ? ('isAnswered'):('')}`} onClick={handleCheckQuestionAsAnswered} />            
                <i className={`icons icon-edit ${isHighlighted ? ('isHighlighted'):('') }`} onClick={handleHighlightQuestion} disabled={isAnswered ? true : false}/>
              </React.StrictMode>
            )}

            <i className='icons icon-trash' onClick={handleDeleteQuestion}/>            
          </div>
        ):(
          <div className='divCards__footer__functions flex'>
            <p className='divCards__quantLikes'>{countLikes}</p>
            <button className='divCards__footer__btnLike' onClick={!isAnswered && handleInsertLike}>
              <i className={`icons icon-like-svgrepo-com ${likeID ? ('isLiked') : ('')}`} />
            </button>                        
          </div>
        )}

      </div>
    </div>
  )
  
}

export default Cards