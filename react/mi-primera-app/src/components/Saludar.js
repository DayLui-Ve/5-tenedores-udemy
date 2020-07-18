import React from 'react'

function Saludar (props){

    const { name, age, color } = props.userInfo

    return (
        <div>
            {/* <h2>Hola {name}, con {age} años y le gusta el color {color}</h2> */}
            <button onClick={() => props.saludarFn(name, age, color)}>saludar</button>
        </div>
    )
}

export default Saludar