pid=$(lsof -tiTCP:3000 | xargs -I {} sudo lsof -p {} | grep node | awk 'NR==1 {print $2}')  
  
# 如果 pid 变量被正确设置，则输出 PID  
if [ -n "$pid" ]; then  
    echo "PID: $pid"  
    kill -9 $pid
else  
    echo "No node process found listening on port 3000"  
fi

pid2=$(lsof -tiTCP:4000 | xargs -I {} sudo lsof -p {} | grep node | awk 'NR==1 {print $2}')  
  
# 如果 pid 变量被正确设置，则输出 pid2  
if [ -n "$pid2" ]; then  
    echo "PID: $pid2"  
    kill -9 $pid2
else  
    echo "No node process found listening on port 4000"  
fi

nodemon index.js