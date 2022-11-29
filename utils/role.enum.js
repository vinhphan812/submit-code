const ROLE = {
	TEACHER: "TEACHER",
	STUDENT: "STUDENT",
};

const PERMISSIONS = { TEACHER: 2, STUDENT: 1 };

const MENU_BY_ROLE = {
	TEACHER: [
		{ name: "Tổng Quan", link: "/admin" },
		{ name: "Người Dùng", link: "/admin/users" },
		{ name: "Buổi Học", link: "/admin/lessons" },
	],
	STUDENT: [
		{
			name: "Hoạt Động",
			link: "/user/orders",
		},
		{
			name: "Ưu Đãi",
			link: "/vouchers",
		},
	],
};

module.exports = { ROLE, PERMISSIONS, MENU_BY_ROLE };
