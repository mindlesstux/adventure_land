// Hey there!
// This is CODE, lets you control your character with code.
// If you don't know how to code, don't worry, It's easy.
// Just set attack_mode to true and ENGAGE!

var attack_mode=true;
var party_heal=false;
var follow_char="PriTuz";

function char_main() {
    
    // If we are dead... respawn!
    if(character.rip) {
        respawn(); 
        return;
    }

    // Check health and Mana
    recover();

    // Loot the things
	loot();

    // Check if our party broke up :(
    tuz_requestpartyup();

	if(!attack_mode || character.rip || is_moving(character)) return;

	var target=get_targeted_monster();
	if(!target)
	{
		target=get_nearest_monster({min_xp:100,max_att:200});
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
		game_log("Attacking");
		attack(target);
	}
}

function recover()
{
    if (safeties && mssince(last_potion) < min(200, character.ping * 3))
        return;

    let used = true;

    let maxHP = character.max_hp, curHP = character.hp, threshHP = character.max_hp*.25;
    let maxMP = character.max_mp, curMP = character.mp, threshMP = character.max_mp*.25;
    
    if (is_on_cooldown("use_hp"))
        return;

    if (curMP / maxMP < 0.1) {
        game_log("Using MP");
        game_log("MP: " + curMP + "/" + maxMP + "::" + (curMP / maxMP));
        use_skill('use_mp'); 
    } else if ((curMP > 700) && (party_heal)) {
        //set_message("Party Healing");
        game_log("HP: " + curHP + "/" + maxHP + "::" + threshHP);
        game_log("MP: " + curMP + "/" + maxMP + "::" + threshMP);
        game_log("Party Healing");
        use_skill('partyheal');
    } else if (curHP < maxHP && curHP > threshHP) {
        game_log("Regen HP");
        use_skill('regen_hp');
    } else if (curMP < maxMP && curMP > threshMP) {
        game_log("Regen MP");
        use_skill('regen_mp');
    } else if (character.hp < threshHP) {
        game_log("Using HP");
        use_skill('use_hp');
    } else if (character.mp < threshMP) {
        game_log("Using MP");
        use_skill('use_mp');
    } else
        used = false;

    if (used)
        last_potion = new Date();
}

function tuz_requestpartyup() {
    if ((typeof character.party !== "undefined") && (character.party != null)) {
        // Do nothing, we are in a party
    } else {
        if (character.name != follow_char) {
            game_log("Sending Party Invite: " + name);
            send_party_request(follow_char);
        } else {
            var tuz_characters = get_characters();
            tuz_characters.forEach(function(element) {
                if ((element.name != follow_char) && (element.online > 0))  {
                    game_log("Sending Party Invite: " + element.name);
                    send_party_request(element.name);
                }
            });
        }
    }
}

function on_party_request(name) // called by the inviter's name
{
    game_log("Party Invite From: " + name);
    var tuz_characters = get_characters();
    tuz_characters.forEach(function(element) {
        if (element.name == name) {
            accept_party_request(name);
        }
    });
}

function tuz_follow(){
    if (character.name != follow_char) {
        var my_characters = get_characters();
    
    }
}

function handle_death()
{
    setTimeout(respawn,20000);
}

// Kick the off the loop
setInterval(function(){
char_main()
},1000/4); // Loops every 1/4 seconds.
