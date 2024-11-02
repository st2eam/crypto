import { useContext } from "react";
import { SecretContext } from "@/store/secret";

const useSecret = () => {
    return useContext(SecretContext);
};

export default useSecret;