export default function Avatar({username,userId,online}){
    const colors = ['bg-red-200', 'bg-green-200', 'bg-purple-200', 'bg-blue-200',
                    'bg-yellow-200', 'bg-teal-200']
    const userIdBase10 = parseInt(userId,16);
    const colind = userIdBase10%colors.length;
    return (
        <div className={"w-10 h-10 relative rounded-full flex items-center "+colors[colind]}>
            <span className="text-center w-full font-bold text-3xl">{username[0]}</span>
            {online && (<div className='absolute w-3 h-3 bg-green-400 bottom-0 right-0 rounded-full'></div>)}
            {!online && (<div className='absolute w-3 h-3 bg-gray-400 bottom-0 right-0 rounded-full'></div>)}
        </div>
    );
}