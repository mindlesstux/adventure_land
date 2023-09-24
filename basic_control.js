// Hey there!
// This is CODE, lets you control your character with code.
// If you don't know how to code, don't worry, It's easy.
// Just set attack_mode to true and ENGAGE!
​
var attack_mode=true
​
//Source code of: use_hp_or_mp
function use_hp_or_mp()
{
    if(safeties && mssince(last_potion)<min(200,character.ping*3)) return resolving_promise({reason:"safeties",success:false,used:false});
    var used=true;
    if(is_on_cooldown("use_hp")) return resolving_promise({success:false,reason:"cooldown"});
    if(character.hp/character.max_hp<0.5) return use_skill('use_hp');
    else if(character.mp/character.max_mp<0.5) return use_skill('use_mp');
    else used=false;
    if(used)
        last_potion=new Date();
    else
        return resolving_promise({reason:"full",success:false,used:false});
}
​
setInterval(function(){
​
    use_hp_or_mp();
    loot();
​
    if(!attack_mode || character.rip || is_moving(character)) return;
​
    var target=get_targeted_monster();
    if(!target)
    {
        target=get_nearest_monster({min_xp:100,max_att:120});
        if(target) change_target(target);
        else
        {
            set_message("No Monsters");
            return;
        }
    }
    
    if(!is_in_range(target))
    {
        move(
            character.x+(target.x-character.x)/2,
            character.y+(target.y-character.y)/2
            );
        // Walk half the distance
    }
    else if(can_attack(target))
    {
        set_message("Attacking");
        attack(target);
    }
​
