import { useEffect, useState } from "react";

const useComponentWillMount = callback => {
    const [mounted, setMounted] = useState(false)
    if (!mounted) callback()
  
    useEffect(() => {
      setMounted(true)
    }, [])
  };

  export default useComponentWillMount;