const API_URL = "http://192.168.0.54:5038";
const { ref, onMounted } = Vue;

const App = {
    setup() {
        const tasks = ref([]);
        const addShow = ref(false);
        // Task CRUD
        const getTasks = async () => {
            console.log("觸發update");
            axios.get(API_URL + "/api/tasks").then((res) => {
                tasks.value = res.data;
                console.log(res.data);
            });
        };
        let enterPressed = false;
        const addNewTask = async (event) => {
            if (event.type === "blur" && enterPressed) {
                enterPressed = false;
                return;
            }
            if (event.type === "keyup" && event.key === "Enter") {
                enterPressed = true;
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
        const deleteTask = async (_id) => {
            navigator.vibrate(10);
            axios.delete(API_URL + "/api/tasks/" + _id).then((res) => {
                // 刪除特定id的物件
                const index = tasks.value.findIndex((task) => task._id === _id);
                if (index !== -1) {
                    tasks.value.splice(index, 1);
                }

                console.log("delete successful");
            });
        };
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
        const showInput = () => {
            navigator.vibrate(10);
            addShow.value = !addShow.value;
            Vue.nextTick(() => {
                document.querySelector("#newTask").focus();
            });
        };

        onMounted(getTasks);
        return { tasks, addNewTask, deleteTask, updateTask, addShow, showInput };
    },
};

Vue.createApp(App).mount("#app");
