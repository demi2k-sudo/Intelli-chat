export default function Avatar({username,userId}){
    const colors = ['bg-red-200', 'bg-green-200', 'bg-purple-200', 'bg-blue-200',
                    'bg-yellow-200', 'bg-teal-200']
    const userIdBase10 = parseInt(userId,16);
    const colind = userIdBase10%colors.length;
    return (
        <div className={"w-10 h-10  rounded-full flex items-center "+colors[colind]}>
            <span className="text-center w-full font-bold text-3xl">{username[0]}</span>
        </div>
    );
}