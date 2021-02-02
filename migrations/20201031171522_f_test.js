
exports.up = function(knex) {
    return knex.schema.raw(`
    CREATE type tiktok_next.f_test_input AS (g text, v double precision); 
    create or replace function tiktok_next.f_test(compressed jsonb)
    returns table(f_val double precision)
    LANGUAGE plpgsql
    as 
    $function$
    begin
    return query with d as (
        select * 
        from jsonb_populate_recordset(null::tiktok_next.f_test_input, $1::jsonb)
    ),
    group_means as (
        select g, avg(v) group_average, count(1) group_count
        from d
        group by g
    ),
    overall_mean as (
        select avg(v) overall_average
        from d
    ),
    sb as (
        select sum(group_count * (overall_average - group_average)^2) sb
        from group_means
        inner join overall_mean on true
    ), 
    msb as (
        select sb / (case when df < 2 then 1 else df - 1 end) msb
        from sb
        inner join 
        (select count(distinct g) df from d) q on true
    ),
    centered as (
        select g, v - group_average centered_value
        from d
        inner join group_means using (g)
    ),
    sw as (
        select sum(centered_value ^ 2) sw
        from centered
    ),
    msw as (
        select sw / nullif((number_groups * (case when observations < 2 then 1 else observations - 1 end)),0) msw
        from sw
        inner join (
            (select count(distinct g) number_groups from d)
        ) q1 on true
        inner join (
            (select group_count observations from group_means limit 1)
        ) q2 on true
    )
    select msb / msw
    from msb
    inner join msw on true;
    end;
    $function$ 
    `);
  };
  
  exports.down = function(knex) {
      return knex.schema.raw(`
        drop function tiktok_next.f_test(compressed jsonb);
        drop type tiktok_next.f_test_input;
    `);
  };
  