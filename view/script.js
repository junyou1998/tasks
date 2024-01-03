const API_URL = "http://192.168.0.54:5038";
const { ref, onMounted } = Vue;

const App = {
    setup() {
        const tasks = ref([]);

        const addShow = ref(false);
        // Task CRUD
        const refreshData = async () => {
            axios.get(API_URL + "/api/tasks").then((res) => {
                tasks.value = res.data;
            });
        };

        let enterPressed = false;
        const addNewTask = async (event) => {

            if (event.type === "keyup" && event.key === "Enter") {
                enterPressed = true;
                event.target.blur();
            }

            if (event.type === "blur" && enterPressed) {
                enterPressed = false; 
                return;
            }

            let newTasks = document.querySelector("#newTask").value;

            if (newTasks != "") {
                const formData = new FormData();
                formData.append("newTasks", newTasks);

                axios.post(API_URL + "/api/tasks", formData).then((res) => {
                    refreshData();
                    // alert(res.data);

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
                refreshData();
                // alert(res.data);
                console.log("delete successful");
            });
        };
        const updateTask = async (_id, updateValue, status) => {
            axios
                .patch(API_URL + "/api/tasks/" + _id, { updateTask: updateValue, doneStatus: status })
                .then((res) => {
                    refreshData();
                    // alert(res.data);
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

        onMounted(refreshData);
        return { tasks, addNewTask, deleteTask, updateTask, addShow, showInput };
    },
};

Vue.createApp(App).mount("#app");
