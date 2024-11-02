import { useContext } from "react";
import { SingletonContext } from "@/store/singleton";

// 自定义钩子来访问单例对象
const useSingleton = () => {
    return useContext(SingletonContext);
};

export default useSingleton;