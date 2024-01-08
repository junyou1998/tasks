// 外置api url 
import config from './config.js';

const API_URL = config.API_URL;
const { ref, onMounted } = Vue;

const App = {
    setup() {
        const tasks = ref([]);
        const addShow = ref(false);
        // Task CRUD
        // 取得所有Tasks 
        const getTasks = async () => {
            console.log("觸發update");
            axios.get(API_URL + "/api/tasks").then((res) => {
                tasks.value = res.data;
                console.log(res.data);
            });
        };
        // 新增事項
        let enterPressed = false; //記錄按下事件
        const addNewTask = async (event) => {

            // 避免因enter造成觸發失焦事件造成兩次觸發
            if (event.type === "blur" && enterPressed) {
                enterPressed = false;
                return;
            }
            if (event.type === "keyup" && event.key === "Enter") {
                enterPressed = true;
                // 送出後跳離輸入框 
                event.target.blur();
            }

            let newTasks = document.querySelector("#newTask").value;

            if (newTasks != "") {
                const formData = new FormData();
                formData.append("newTasks", newTasks);

                await axios.post(API_URL + "/api/tasks", formData).then((res) => {
                    // 直接將返回內容手動加入vue變數
                    tasks.value.unshift(res.data);
                    console.log("add successful");

                    // 清空輸入框
                    event.target.value = "";

                    enterPressed = false;
                });
            } else {
                console.log("no data");
            }
            addShow.value = false;
        };

        // 刪除事項 
        const deleteTask = async (_id) => {
            // navigator.vibrate(10);
            axios.delete(API_URL + "/api/tasks/" + _id).then((res) => {
                // 刪除特定id的物件
                const index = tasks.value.findIndex((task) => task._id === _id);
                if (index !== -1) {
                    tasks.value.splice(index, 1);
                }

                console.log("delete successful");
            });
        };

        // 更新事項 
        const updateTask = async (_id, updateValue, status) => {
            axios
                .patch(API_URL + "/api/tasks/" + _id, { updateTask: updateValue, doneStatus: status })
                .then((res) => {
                    // 把回傳更新內容直接加入vue變數中
                    const index = tasks.value.findIndex((task) => task._id === _id);
                    if (index !== -1) {
                        tasks.value[index] = { ...tasks.value[index], ...res.data };
                    }

                    console.log("update successful");
                })
                .catch((err) => {
                    console.error("error updating task", err);
                });
        };

        // 新增輸入框的顯示狀態切換 
        const showInput = () => {
            // navigator.vibrate(10);
            addShow.value = !addShow.value;
            // 避免vue尚未更新無法抓取物件 使用nextTick確保已完成才執行
            Vue.nextTick(() => {
                document.querySelector("#newTask").focus();
            });
        };

        onMounted(getTasks); //物件渲染完成後進行資料撈取

        return { tasks, addNewTask, deleteTask, updateTask, addShow, showInput };
    },
};

Vue.createApp(App).mount("#app");
