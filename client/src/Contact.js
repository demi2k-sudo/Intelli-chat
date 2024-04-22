import Avatar from '../src/Avatar.js'

export default function Contact({id, onClick,username, selected, online}){
    return(
        <div onClick={()=>onClick(id)} className={"border-b flex border-gray-100 py-2 px-1 gap-2 items-center cursor-pointer "+(selected?"bg-red-500 rounded-lg mr-2":"")}>
                        {selected && (
                            <div className="w-1 bg-red-400 rounded-lg h-12">

                            </div>
                        )}
                        <Avatar online={online} username = {username} userId = {id}/>
                        <span className="text-gray-800">{username}</span>
                    </div>
    )
}