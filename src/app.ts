import express,{Request,Response} from 'express';

const app = express();
app.use(express.json());
app.get('/', (req:Request, res: Response) => {
    res.status(200).json({
        success:true,
    })
})


const WEBHOOK_URL_DISCORD = "https://discord.com/api/webhooks/1204808613562941481/GMQXJhzB9tps07oYoZZHekK9_AC0SFBW83MNpQ9wvaFtCTnqTSX30cG_TcExqQV4RUB9";

const notifyDiscord= async(message:string) =>{
    const body={
        content: message
    }
    const resp = await fetch(WEBHOOK_URL_DISCORD,{

        method:"POST",
        headers:{'content-type':'application/json'},
        body:JSON.stringify(body)
    });

    if (!resp.ok){
        console.log("error al enviar informacion a discord")
        return false;
    }
    return true;
}
app.listen(3000, ()=>{
    console.log("API CORRIENDO EN EL PUERTO 3000")
})

app.post('/github-event', (req:Request, res: Response)=>{
    const  {body} = req;
    const {action, sender, repository}= body;
    const event = req.header('x-github-event');
    console.log(body);
    let message="";
    switch (event) {
        case "star":
            message=`${sender.login} ${action} Star on ${repository.full_name}`
            break;
        case "issues":
            const {issue} = body;
            message=`${sender.login} ${action} issue ${issue} Start on ${repository.full_name}`
            break;

        case "push":
            message=`${sender.login} pushes on ${repository.full_name}`
        default:
            message=`evento desconocido : ${event}`
            break;
    }

    notifyDiscord(message)
    res.status(200).json({
        success:true,
    })
})