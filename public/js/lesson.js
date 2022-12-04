Onload = () => {
    const unit = "Bài Tập ";
    $("form").submit((e) => {
        const $exercises = $("input[name='exercises']");
        const value = [];

        const $inpExersice = $("input[name='exercise']");
        const $inpDescription = $("textarea[name='exercise_description']");

        $inpExersice.each((i, e) => {
            value.push({
                name: e.value,
                description: $inpDescription[i].innerHTML,
            });
        });
        $exercises.val(JSON.stringify(value));
        table.rows().remove().draw();
        return true;
    });

    $(".add").click((e) => {
        const index = table.rows()[0].length + 1;
        table.row
            .add([
                index,
                renderInput("exercise", unit + index, "Bài tập..."),
                renderInput("exercise_description", "", "Đề hoặc mô tả bài tập"),
                null,
            ])
            .draw();
    });

    $("input[name='total_exercise']").change((e) => {
        table.rows().remove();
        const value = +e.target.value;
        if (typeof value != "number") return;

        const result = [];

        for (let i = 1; i <= value; i++) {
            result.push([
                i,
                renderInput("exercise", unit + i, "Bài tập..."),
                renderTextArea("exercise_description", "", "Đề hoặc mô tả bài tập"),
                null,
            ]);
        }
        table.rows.add(result).draw();
    });
    $("input[type='file']").change(async (e) => {
        const files = e.target.files;
        if (files.length <= 0)
            return "";
        let data = await files[0].text();

        if (!data) return "";

        data = data.split("\n");

        table.rows().remove();

        const result = [];

        for (let i = 0; i < data.length; i++) {
            result.push([
                i + 1,
                renderInput("exercise", unit + (i + 1), "Bài tập..."),
                renderTextArea("exercise_description", data[i], "Đề hoặc mô tả bài tập"),
                null,
            ]);
        }

        table.rows.add(result).draw();
    })
};