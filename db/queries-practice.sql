    `
    SELECT r.title as 'role_title', r.id as role_id, d.department_name, r.salary
    FROM role r
    LEFT JOIN department d
    ON r.department_id = d.id
    ORDER BY r.id;

    SELECT e.id as 'employee_id', e.first_name, e.last_name, r.title as 'job_title', d.department_name, r.salary, mgr.first_name as manager_first_name, mgr.last_name as manager_last_name
    FROM employee e
    JOIN role r
    ON e.id = r.id
    JOIN department d
    ON r.department_id = d.id
    LEFT JOIN employee mgr
    on mgr.id = e.manager_id
    order by e.id;

    INSERT INTO department (department_name)
    VALUES (Information Technology);

INSERT INTO department (department_name) values ("Information Technology")

UPDATE employee SET role_id = 5 WHERE id = 8

select * from role;

    `