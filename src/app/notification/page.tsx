
import Image from 'next/image';
import logo from "../../../public/logo.png"

const Exemplos = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "08", "09", "10"]

export default function NotificationPage() {
    return (
        <div className="
        flex flex-row text-black
        w-[95vw] h-[90vh] bg-white py-[20px]
        ">
            <div className="flex flex-col w-[20%] h-[100%] items-center justify-center">
                Filtros
            </div>
            <ul className="flex flex-col w-[80%] h-[100%] items-center overflow-auto">
                {Exemplos.map((ex, index) => (
                    <li key={index} className="
                        w-[90%] h-[100px] bg-[#EBEAEA] rounded-xl mb-[20px] flex-shrink-0
                    ">
                        <ul className="flex flex-row w-[100%] h-[100%] items-center justify-around text-center">
                            <li className="w-[15%]">
                                <Image src={logo} className="w-[90px] h-[90px] rounded-full" alt="Logo da Empresa" />
                            </li>
                            <ul className="flex flex-col w-[50%] text-start">
                                <li>{ex}</li>
                                <li>Descrição</li>
                            </ul>
                            <li className="w-[90px]">Acessar</li>
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    )
}